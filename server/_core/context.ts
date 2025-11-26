import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

const demoUser: User = {
  id: 1,
  openId: "demo-user",
  name: "Demo User",
  email: "demo@example.com",
  loginMethod: "demo",
  role: "user",
  vosRole: null,
  maturityLevel: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  return {
    req: opts.req,
    res: opts.res,
    user: demoUser,
  };
}
