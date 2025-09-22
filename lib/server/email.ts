import { db, eq, tables } from "@/database";
import { encodeBase32 } from "@oslojs/encoding";
import { generateRandomOTP } from "./utils";
import { resend } from "./resend";
import { VerificationCodeRequestMail } from "@/emails/VerificationCodeRequestMail";
import { ExpiringTokenBucket } from "./rate-limit";
interface Props {
  code: string;
  email: string;
}
export async function sendVerificationCodeRequest({ code, email }: Props) {
  try {
    await resend.emails.send({
      from: "Team Vikings <noreply@thecodingmontana.com>",
      to: [email],
      subject: `Your unique vikings traders verification code is ${code}`,
      react: await VerificationCodeRequestMail({ code }),
    });
  }
  catch (error: any) {
    throw new Error(error.message);
  }
}
export function verifyEmailInput(email: string): boolean {
  return /^.+@.+\..+$/.test(email) && email.length < 256;
}
export async function checkEmailAvailability(email: string): Promise<boolean> {
  const user = await db.query.user.findFirst({
    where: (table) => eq(table.email, email),
  });
  if (user) {
    return true;
  }
  return false;
}
export async function createEmailVerificationRequest(
  user_id: string,
  email: string
): Promise<EmailVerificationRequest> {
  await deleteUserEmailVerificationRequest(user_id);
  const idBytes = new Uint8Array(20);
  crypto.getRandomValues(idBytes);
  const id = encodeBase32(idBytes).toLowerCase();
  const code = generateRandomOTP();
  const expires_at = new Date(Date.now() + 1000 * 60 * 10);
  await db.insert(tables.email_verification_request_table).values({
    code,
    email,
    user_id,
    expires_at,
  });
  const request: EmailVerificationRequest = {
    id,
    user_id,
    code,
    email,
    expires_at,
  };
  return request;
}
export async function deleteUserEmailVerificationRequest(
  user_id: string
): Promise<void> {
  await db
    .delete(tables.email_verification_request_table)
    .where(eq(tables.email_verification_request_table.user_id, user_id));
}
export const sendVerificationEmailBucket = new ExpiringTokenBucket<string>(3, 60 * 10);
export interface EmailVerificationRequest {
  id: string;
  user_id: string;
  code: string;
  email: string;
  expires_at: Date;
}
