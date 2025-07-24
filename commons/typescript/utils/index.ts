import { createHash } from "crypto";

export * from "./aws-secrets-manager";

export function hashToSha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}
