import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

function getDatabaseConfig(databaseUrl: string) {
  const url = new URL(databaseUrl);
  const schema = url.searchParams.get("schema") ?? undefined;

  if (!schema) {
    return {
      connectionString: databaseUrl,
      schema,
    };
  }

  url.searchParams.delete("schema");

  return {
    connectionString: url.toString(),
    schema,
  };
}

const databaseConfig = getDatabaseConfig(connectionString);

const pool =
  globalForPrisma.prismaPool ??
  new Pool({
    connectionString: databaseConfig.connectionString,
  });

const adapter = new PrismaPg(
  pool,
  databaseConfig.schema ? { schema: databaseConfig.schema } : undefined,
);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPool = pool;
}
