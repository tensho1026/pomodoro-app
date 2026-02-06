import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const AUTH_COOKIE_NAME = "pomodoro_demo_auth";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  authProvider: "clerk-mock";
};

export const MOCK_USER: AppUser = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@example.com",
  authProvider: "clerk-mock",
};

export async function getCurrentUser(): Promise<AppUser | null> {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (sessionValue !== MOCK_USER.id) {
    return null;
  }

  return MOCK_USER;
}

export async function requireCurrentUser(): Promise<AppUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
