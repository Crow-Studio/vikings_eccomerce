import { db, eq, tables } from "@/database";
import { encodeBase32 } from "@oslojs/encoding";
import { generateRandomOTP } from "./utils";
import { v4 as uuidv4 } from "uuid";
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
      from: "Team delirium <noreply@thecodingmontana.com>",
      to: [email],
      subject: `Your unique derilium verification code is ${code}`,
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

  console.log(user, email);

  if (user) {
    return true;
  }
  return false;
}

export async function createEmailVerificationRequest(
  userId: string,
  email: string
): Promise<EmailVerificationRequest> {
  await deleteUserEmailVerificationRequest(userId);
  const idBytes = new Uint8Array(20);
  crypto.getRandomValues(idBytes);
  const id = encodeBase32(idBytes).toLowerCase();

  const code = generateRandomOTP();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

  await db.insert(tables.email_verification_request_table).values({
    id: uuidv4(),
    code,
    email,
    userId,
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const request: EmailVerificationRequest = {
    id,
    userId,
    code,
    email,
    expiresAt,
  };
  return request;
}

export async function deleteUserEmailVerificationRequest(
  userId: string
): Promise<void> {
  await db
    .delete(tables.email_verification_request_table)
    .where(eq(tables.email_verification_request_table.userId, userId));
}

export const sendVerificationEmailBucket = new ExpiringTokenBucket<string>(3, 60 * 10);

export interface EmailVerificationRequest {
  id: string;
  userId: string;
  code: string;
  email: string;
  expiresAt: Date;
}
