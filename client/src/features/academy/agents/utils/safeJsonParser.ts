import { z } from "zod";

/**
 * SafeJsonParser - Robust LLM Output Parsing
 * 
 * Handles common LLM output issues:
 * - Markdown code blocks (```json)
 * - Mixed text and JSON
 * - Trailing commas
 * - Unescaped quotes
 * - Schema validation
 */

export class JsonParseError extends Error {
  constructor(
    message: string,
    public readonly rawContent: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = "JsonParseError";
  }
}

/**
 * Clean markdown code blocks and extract JSON
 */
function cleanMarkdown(content: string): string {
  // Remove markdown code blocks
  let cleaned = content.replace(/```json\n?|\n?```/g, "").trim();

  // If still has backticks, try to extract content between them
  if (cleaned.includes("```")) {
    const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      cleaned = match[1].trim();
    }
  }

  return cleaned;
}

/**
 * Extract JSON substring from mixed content
 */
function extractJson(content: string): string {
  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || firstBrace > lastBrace) {
    // Try array syntax
    const firstBracket = content.indexOf("[");
    const lastBracket = content.lastIndexOf("]");

    if (
      firstBracket !== -1 &&
      lastBracket !== -1 &&
      firstBracket < lastBracket
    ) {
      return content.substring(firstBracket, lastBracket + 1);
    }

    throw new Error("No valid JSON structure found");
  }

  return content.substring(firstBrace, lastBrace + 1);
}

/**
 * Repair common JSON errors
 */
function repairJson(jsonString: string): string {
  let repaired = jsonString;

  // Remove trailing commas before closing braces/brackets
  repaired = repaired.replace(/,(\s*[}\]])/g, "$1");

  // Fix unescaped quotes in strings (basic heuristic)
  // This is a simplified version - production would need more sophisticated handling
  repaired = repaired.replace(/([^\\])"([^",:}\]]*)":/g, '$1\\"$2":');

  return repaired;
}

/**
 * Parse and validate LLM output against a Zod schema
 * 
 * @param content - Raw LLM output
 * @param schema - Zod schema to validate against
 * @param options - Parsing options
 * @returns Validated and typed data
 * @throws JsonParseError if parsing or validation fails
 */
export async function parseLLMOutput<T>(
  content: string,
  schema: z.ZodSchema<T>,
  options: {
    attemptRepair?: boolean;
    throwOnValidationError?: boolean;
  } = {}
): Promise<T> {
  const { attemptRepair = true, throwOnValidationError = true } = options;

  try {
    // Step 1: Clean markdown
    let cleaned = cleanMarkdown(content);

    // Step 2: Extract JSON
    let jsonString = extractJson(cleaned);

    // Step 3: Attempt repair if enabled
    if (attemptRepair) {
      jsonString = repairJson(jsonString);
    }

    // Step 4: Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      throw new JsonParseError(
        "Failed to parse JSON",
        content,
        parseError as Error
      );
    }

    // Step 5: Validate schema
    const result = schema.safeParse(parsed);

    if (!result.success) {
      if (throwOnValidationError) {
        throw new JsonParseError(
          `Schema validation failed: ${result.error.message}`,
          content,
          result.error
        );
      }
      console.warn("Schema validation failed, returning unvalidated data:", result.error);
      return parsed as T;
    }

    return result.data;
  } catch (error) {
    if (error instanceof JsonParseError) {
      throw error;
    }
    throw new JsonParseError(
      `Unexpected error during parsing: ${error instanceof Error ? error.message : String(error)}`,
      content,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Parse with retry logic - sends error back to LLM for self-correction
 * 
 * @param getLLMResponse - Function to call LLM with a prompt
 * @param initialContent - Initial LLM output
 * @param schema - Zod schema
 * @param maxRetries - Maximum retry attempts
 * @returns Validated data or throws after max retries
 */
export async function parseLLMOutputWithRetry<T>(
  getLLMResponse: (prompt: string) => Promise<string>,
  initialContent: string,
  schema: z.ZodSchema<T>,
  maxRetries: number = 2
): Promise<T> {
  let content = initialContent;
  let lastError: JsonParseError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await parseLLMOutput(content, schema);
    } catch (error) {
      if (!(error instanceof JsonParseError)) {
        throw error;
      }

      lastError = error;

      if (attempt < maxRetries) {
        // Generate retry prompt
        const retryPrompt = `Your previous response had a JSON formatting error: ${error.message}

Please provide a corrected response that is valid JSON.

Your previous response was:
${content}

Provide ONLY the corrected JSON, with no additional text or markdown.`;

        content = await getLLMResponse(retryPrompt);
      }
    }
  }

  throw lastError || new Error("Failed to parse after retries");
}

/**
 * Utility to validate if a string contains valid JSON
 */
export function isValidJson(content: string): boolean {
  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract and parse multiple JSON objects from content
 */
export function parseMultipleJson<T>(
  content: string,
  schema: z.ZodSchema<T>
): T[] {
  const results: T[] = [];
  const jsonRegex = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
  const matches = content.match(jsonRegex);

  if (!matches) {
    return results;
  }

  for (const match of matches) {
    try {
      const parsed = JSON.parse(match);
      const validated = schema.safeParse(parsed);
      if (validated.success) {
        results.push(validated.data);
      }
    } catch {
      // Skip invalid JSON
      continue;
    }
  }

  return results;
}
