import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  authProvider: "clerk";
};

const hasClerkEnvironment =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

function getDisplayNameFromClerkUser(user: Awaited<ReturnType<typeof currentUser>>) {
  if (!user) {
    return "";
  }

  if (user.fullName) {
    return user.fullName;
  }

  const combined = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (combined) {
    return combined;
  }

  return user.username ?? "";
}

export async function getCurrentUser(): Promise<AppUser | null> {
  if (!hasClerkEnvironment) {
    return null;
  }

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return null;
  }

  const email =
    user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "";

  return {
    id: user.id,
    name: getDisplayNameFromClerkUser(user),
    email,
    authProvider: "clerk",
  };
}

export async function requireCurrentUser(): Promise<AppUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}
