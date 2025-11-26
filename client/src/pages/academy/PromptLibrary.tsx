import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_LOGO, APP_TITLE } from "@/const";
import {
  Brain,
  ArrowLeft,
  Search,
  Target,
  TrendingUp,
  Award,
  Rocket,
  RefreshCw,
  Copy,
  ExternalLink,
  BookOpen,
  Filter,
  Star,
  Clock,
  Users,
  MessageSquare,
  Lightbulb,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";

interface AIPrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  promptText: string;
  usageGuidelines: {
    inputs: string[];
    outputs: string;
    maturityLevel: number;
    examples: Array<{
      input: string;
      output: string;
    }>;
  };
  targetRoles: string[];
  targetMaturityLevel: number;
  tags: string[];
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockPrompts: AIPrompt[] = [
  {
    id: 'discovery-001',
    title: 'Value Discovery Framework',
    description: 'Comprehensive prompt for conducting value-focused discovery conversations',
    category: 'discovery',
    subcategory: 'initial-conversations',
    promptText: `You are a Value Operations consultant helping a customer discover their business challenges and opportunities. Your goal is to uncover value gaps using the Revenue/Cost/Risk framework.

Context: [Customer context, industry, size, current situation]

Your task:
1. Ask discovery questions that reveal:
   - Revenue opportunities or risks
   - Cost optimization opportunities  
   - Risk mitigation needs
2. Listen for indicators of value gaps
3. Guide conversation toward business outcomes, not features
4. Document key value drivers for later analysis

Approach:
- Start with broad business challenges
- Use open-ended questions
- Quantify impact when possible
- Connect symptoms to root causes
- Maintain value-focused language throughout

Begin by introducing yourself and asking about their current business priorities and challenges.`,
    usageGuidelines: {
      inputs: ['Customer context', 'Industry', 'Current challenges', 'Business priorities'],
      outputs: 'Structured discovery notes with identified value gaps and Revenue/Cost/Risk categorization',
      maturityLevel: 1,
      examples: [
        {
          input: 'Manufacturing company, 500 employees, struggling with production efficiency',
          output: 'Discovery questions focused on production bottlenecks, quality costs, revenue impact of delays, and scalability risks'
        }
      ]
    },
    targetRoles: ['Sales', 'CS', 'VE'],
    targetMaturityLevel: 1,
    tags: ['discovery', 'value-gap', 'revenue-cost-risk'],
    version: '1.0',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'roi-001',
    title: 'ROI Model Builder',
    description: 'Generate comprehensive ROI models based on customer value drivers',
    category: 'roi_modeling',
    subcategory: 'financial-modeling',
    promptText: `You are a financial analyst specializing in value measurement and ROI modeling for technology investments.

Customer Context: [Customer details, industry, size]
Value Drivers Identified: [List of specific value drivers from discovery]
Time Horizon: [Typically 12-36 months]

Your task:
Build a comprehensive ROI model that includes:

1. Revenue Impact:
   - New revenue opportunities
   - Revenue acceleration
   - Market expansion potential
   - Customer lifetime value improvements

2. Cost Optimization:
   - Direct cost savings
   - Efficiency improvements
   - Resource optimization
   - Reduced waste/errors

3. Risk Mitigation:
   - Compliance risk reduction
   - Operational risk improvements
   - Competitive risk mitigation
   - Technology risk reduction

4. Implementation Costs:
   - Software/license costs
   - Implementation time
   - Training requirements
   - Change management

5. ROI Calculations:
   - Net Present Value (NPV)
   - Internal Rate of Return (IRR)
   - Payback period
   - Return on Investment (ROI)

Assumptions:
- Be conservative in estimates
- Document all assumptions clearly
- Include sensitivity analysis
- Consider both hard and soft benefits

Format: Present as a structured financial model with clear calculations and explanations.`,
    usageGuidelines: {
      inputs: ['Customer value drivers', 'Industry benchmarks', 'Implementation costs', 'Time horizon'],
      outputs: 'Comprehensive ROI model with financial calculations and assumptions',
      maturityLevel: 2,
      examples: [
        {
          input: 'SaaS company, 200 employees, looking to improve customer onboarding',
          output: 'ROI model showing reduced onboarding time, improved customer retention, and support cost savings'
        }
      ]
    },
    targetRoles: ['Sales', 'VE'],
    targetMaturityLevel: 2,
    tags: ['roi', 'financial-modeling', 'value-quantification'],
    version: '1.2',
    isActive: true,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  },
  {
    id: 'realization-001',
    title: 'Customer Success Value Tracking',
    description: 'Monitor and measure value realization throughout the customer lifecycle',
    category: 'realization',
    subcategory: 'success-monitoring',
    promptText: `You are a Customer Success Manager focused on measuring and maximizing value realization for your customers.

Customer: [Customer name, industry, size]
Original Value Proposition: [What was promised during sales]
Implementation Status: [Current stage]
Time Since Implementation: [Months/quarters]

Your task:
1. Assess Current Value Realization:
   - Review actual vs. expected outcomes
   - Identify gaps in value delivery
   - Document success stories and case studies
   - Quantify realized benefits where possible

2. Identify Expansion Opportunities:
   - Additional use cases or departments
   - Advanced feature adoption
   - Process improvements
   - Strategic partnerships

3. Risk Assessment:
   - Renewal risk factors
   - Competitive threats
   - Usage decline indicators
   - Satisfaction concerns

4. Action Plan:
   - Short-term value optimization actions
   - Long-term strategic initiatives
   - Executive summary for stakeholders
   - Success metrics and KPIs

Approach:
- Use data-driven insights
- Include customer testimonials
- Provide specific, actionable recommendations
- Align with customer business objectives

Output: Comprehensive value realization report with clear next steps.`,
    usageGuidelines: {
      inputs: ['Customer data', 'Usage metrics', 'Business outcomes', 'Customer feedback'],
      outputs: 'Value realization report with assessment and recommendations',
      maturityLevel: 2,
      examples: [
        {
          input: 'Healthcare provider, 6 months post-implementation, using patient management system',
          output: 'Analysis showing improved patient outcomes, reduced admin costs, and expansion opportunities'
        }
      ]
    },
    targetRoles: ['CS', 'Sales'],
    targetMaturityLevel: 2,
    tags: ['customer-success', 'value-realization', 'retention'],
    version: '1.1',
    isActive: true,
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: 'expansion-001',
    title: 'Expansion Opportunity Analysis',
    description: 'Identify and quantify expansion opportunities within existing accounts',
    category: 'expansion',
    subcategory: 'account-growth',
    promptText: `You are an Account Executive focused on identifying and pursuing expansion opportunities within your existing customer base.

Account: [Customer name, current solution, tenure]
Current Value Realization: [How they're using the product, outcomes achieved]
Relationship Strength: [Executive sponsorship, user satisfaction, renewal risk]

Your task:
1. Analyze Current State:
   - Review product usage patterns
   - Assess satisfaction levels
   - Identify power users and champions
   - Document current business value

2. Identify Expansion Opportunities:
   - Additional departments or business units
   - Advanced feature adoption
   - Strategic initiatives alignment
   - Competitive displacement opportunities

3. Build Business Case:
   - Quantify additional value potential
   - Map to strategic priorities
   - Develop ROI projections
   - Create implementation roadmap

4. Stakeholder Analysis:
   - Identify key decision makers
   - Assess influence and interest
   - Develop engagement strategy
   - Plan executive conversations

5. Risk Assessment:
   - Implementation challenges
   - Change management requirements
   - Competitive threats
   - Resource constraints

Approach:
- Focus on customer business outcomes
- Use data-driven insights
- Align with customer strategic goals
- Build consensus across stakeholders

Output: Comprehensive expansion opportunity analysis with actionable next steps.`,
    usageGuidelines: {
      inputs: ['Account data', 'Usage analytics', 'Business outcomes', 'Strategic priorities'],
      outputs: 'Expansion opportunity analysis with business case and action plan',
      maturityLevel: 3,
      examples: [
        {
          input: 'Financial services firm, heavy users of core platform, 3-year customer',
          output: 'Analysis showing opportunities in compliance, risk management, and customer onboarding departments'
        }
      ]
    },
    targetRoles: ['Sales', 'CS'],
    targetMaturityLevel: 3,
    tags: ['expansion', 'account-growth', 'cross-sell'],
    version: '1.0',
    isActive: true,
    createdAt: '2024-02-01T11:20:00Z',
    updatedAt: '2024-02-01T11:20:00Z'
  },
  {
    id: 'governance-001',
    title: 'Value Governance Framework',
    description: 'Establish governance processes for value measurement and optimization',
    category: 'governance',
    subcategory: 'process-optimization',
    promptText: `You are a Value Operations leader establishing governance frameworks for value measurement and optimization.

Organization: [Company details, size, industry]
Current State: [Existing processes, tools, challenges]
Objectives: [What you want to achieve with governance]

Your task:
1. Design Governance Structure:
   - Define roles and responsibilities
   - Establish decision-making processes
   - Create review cadences and forums
   - Document escalation paths

2. Measurement Framework:
   - Define standard value metrics
   - Establish data collection processes
   - Create reporting templates
   - Set performance thresholds

3. Process Optimization:
   - Map end-to-end value processes
   - Identify bottlenecks and inefficiencies
   - Design improved workflows
   - Implement automation opportunities

4. Technology Integration:
   - Assess current tool landscape
   - Identify integration opportunities
   - Define data architecture
   - Plan technology roadmap

5. Change Management:
   - Assess organizational readiness
   - Identify change champions
   - Develop communication plan
   - Design training programs

6. Continuous Improvement:
   - Establish feedback loops
   - Create optimization processes
   - Define success metrics
   - Plan regular reviews

Approach:
- Start with current state assessment
- Prioritize quick wins
- Ensure stakeholder buy-in
- Plan for scalability

Output: Comprehensive governance framework with implementation roadmap.`,
    usageGuidelines: {
      inputs: ['Organizational assessment', 'Current processes', 'Technology landscape', 'Strategic objectives'],
      outputs: 'Governance framework with roles, processes, and implementation plan',
      maturityLevel: 4,
      examples: [
        {
          input: 'Enterprise software company, struggling with value measurement consistency',
          output: 'Governance framework establishing standard metrics, processes, and tools for value operations'
        }
      ]
    },
    targetRoles: ['VE', 'Leadership'],
    targetMaturityLevel: 4,
    tags: ['governance', 'process-optimization', 'measurement'],
    version: '1.0',
    isActive: true,
    createdAt: '2024-02-05T13:10:00Z',
    updatedAt: '2024-02-05T13:10:00Z'
  }
];

const categoryIcons = {
  discovery: Target,
  roi_modeling: TrendingUp,
  realization: Award,
  expansion: Rocket,
  governance: RefreshCw,
};

const categoryColors = {
  discovery: 'text-blue-600 bg-blue-50',
  roi_modeling: 'text-green-600 bg-green-50',
  realization: 'text-purple-600 bg-purple-50',
  expansion: 'text-orange-600 bg-orange-50',
  governance: 'text-red-600 bg-red-50',
};

export default function PromptLibrary() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedMaturityLevel, setSelectedMaturityLevel] = useState<string>('all');
  const [selectedPrompt, setSelectedPrompt] = useState<AIPrompt | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const filteredPrompts = mockPrompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    const matchesRole = selectedRole === 'all' || prompt.targetRoles.includes(selectedRole);
    const matchesMaturity = selectedMaturityLevel === 'all' || prompt.targetMaturityLevel.toString() === selectedMaturityLevel;
    
    return matchesSearch && matchesCategory && matchesRole && matchesMaturity;
  });

  const handleCopyPrompt = async (prompt: AIPrompt) => {
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopiedPromptId(prompt.id);
      setTimeout(() => setCopiedPromptId(null), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const getMaturityLevelLabel = (level: number) => {
    const labels = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'];
    return labels[level] || 'L0';
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/academy/dashboard" className="flex items-center gap-2">
              <img src={APP_LOGO} alt="VOS Logo" className="h-8 w-8" />
              <span className="font-bold text-xl">{APP_TITLE}</span>
            </Link>
            <div className="h-6 w-px bg-border mx-2" />
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI Prompt Library</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/academy/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Back to Academy
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">AI Prompt Library</h1>
            <p className="text-muted-foreground text-lg">
              Curated prompts for value operations, discovery, ROI modeling, and more
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Brain className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{mockPrompts.length}</div>
                    <div className="text-sm text-muted-foreground">Total Prompts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {Object.entries(categoryIcons).map(([category, Icon]) => {
              const count = mockPrompts.filter(p => p.category === category).length;
              return (
                <Card key={category}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Icon className="h-8 w-8 text-primary" />
                      <div>
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-sm text-muted-foreground capitalize">{category}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search prompts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.keys(categoryIcons).map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="CS">Customer Success</SelectItem>
                    <SelectItem value="VE">Value Engineer</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedMaturityLevel} onValueChange={setSelectedMaturityLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Maturity Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {[0, 1, 2, 3, 4, 5].map(level => (
                      <SelectItem key={level} value={level.toString()}>
                        {getMaturityLevelLabel(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Prompts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredPrompts.map((prompt) => {
              const Icon = categoryIcons[prompt.category as keyof typeof categoryIcons];
              const colorClass = categoryColors[prompt.category as keyof typeof categoryColors];
              
              return (
                <Card key={prompt.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPrompt(prompt)}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getMaturityLevelLabel(prompt.targetMaturityLevel)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{prompt.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{prompt.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {prompt.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{prompt.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {prompt.targetRoles.length} roles
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          v{prompt.version}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </main>

      {/* Prompt Detail Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${categoryColors[selectedPrompt.category as keyof typeof categoryColors]}`}>
                      {(() => {
                        const Icon = categoryIcons[selectedPrompt.category as keyof typeof categoryIcons];
                        return <Icon className="h-6 w-6" />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPrompt.title}</h2>
                      <p className="text-muted-foreground">{selectedPrompt.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">{selectedPrompt.category}</Badge>
                    <Badge variant="outline">{getMaturityLevelLabel(selectedPrompt.targetMaturityLevel)}</Badge>
                    {selectedPrompt.targetRoles.map((role) => (
                      <Badge key={role} variant="secondary">{role}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopyPrompt(selectedPrompt)}
                  >
                    {copiedPromptId === selectedPrompt.id ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPrompt(null)}>
                    ×
                  </Button>
                </div>
              </div>

              {/* Prompt Text */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Prompt Text
                </h3>
                <div className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap">
                  {selectedPrompt.promptText}
                </div>
              </div>

              {/* Usage Guidelines */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Usage Guidelines
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Required Inputs</h4>
                    <ul className="space-y-1 text-sm">
                      {selectedPrompt.usageGuidelines.inputs.map((input, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {input}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Expected Output</h4>
                    <p className="text-sm text-muted-foreground">{selectedPrompt.usageGuidelines.outputs}</p>
                  </div>
                </div>
              </div>

              {/* Examples */}
              {selectedPrompt.usageGuidelines.examples.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Examples
                  </h3>
                  <div className="space-y-4">
                    {selectedPrompt.usageGuidelines.examples.map((example, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2 text-sm">Input</h4>
                            <div className="p-3 bg-muted rounded text-sm">{example.input}</div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 text-sm">Output</h4>
                            <div className="p-3 bg-muted rounded text-sm">{example.output}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPrompt.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
