"use server";

import { globalPOSTRateLimit } from "@/lib/server/request";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/lib/server/session";
import { ActionResult } from "@/types";
import { redirect } from "next/navigation";

export async function signoutAction(): Promise<ActionResult> {
  if (!(await globalPOSTRateLimit())) {
    return {
      errorMessage: "Too many requests",
      message: null
    };
  }
  const { session } = await getCurrentSession();
  if (session === null) {
    return {
      errorMessage: "Not authenticated",
      message: null
    };
  }
  await invalidateSession(session.id);
  await deleteSessionTokenCookie();
  return redirect("/auth/admin/signin");
}
