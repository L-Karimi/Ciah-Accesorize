import { Prisma } from "@prisma/client";

const SETUP_ERROR_PATTERNS = [
  /does not exist in the current database/i,
  /permission denied for schema public/i,
  /column .* does not exist/i,
  /table .* does not exist/i,
];

const SETUP_ERROR_CODES = new Set(["P1001", "P1010", "P2021", "P2022"]);

export function isPrismaSetupError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return SETUP_ERROR_CODES.has(error.code);
  }

  if (error instanceof Error) {
    return SETUP_ERROR_PATTERNS.some((pattern) => pattern.test(error.message));
  }

  return false;
}

export function getDatabaseSetupErrorMessage(feature: string) {
  return `Database setup is incomplete right now, so we could not ${feature}. Run the Prisma migrations and try again.`;
}
