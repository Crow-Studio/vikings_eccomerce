import { encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";
export function generateRandomOTP(): string {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  const code = encodeBase32UpperCaseNoPadding(bytes);
  return code;
}
export function generateRandomRecoveryCode(): string {
  const recoveryCodeBytes = new Uint8Array(10);
  crypto.getRandomValues(recoveryCodeBytes);
  const recoveryCode = encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
  return recoveryCode;
}

export function extractPublicId(url: string): string | null {
  try {
    const parts = url.split("/")
    const filename = parts[parts.length - 1]
    return filename.split(".")[0] 
  } catch {
    return null
  }
}