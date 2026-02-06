"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_COOKIE_NAME, MOCK_USER } from "@/lib/auth";

export async function signInMockClerkAction() {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, MOCK_USER.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/");
}

export async function signOutMockClerkAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);

  redirect("/login");
}
