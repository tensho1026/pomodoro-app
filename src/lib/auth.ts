import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

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

function getEmailFromClerkUser(user: Awaited<ReturnType<typeof currentUser>>) {
  if (!user) {
    return "";
  }

  return (
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    `${user.id}@clerk.local`
  );
}

async function syncUserToDatabase({
  clerkId,
  email,
  displayName,
}: {
  clerkId: string;
  email: string;
  displayName: string;
}) {
  if (!prisma) {
    return;
  }

  await prisma.user.upsert({
    where: {
      clerkId,
    },
    update: {
      email,
      displayName: displayName || null,
    },
    create: {
      clerkId,
      email,
      displayName: displayName || null,
    },
  });
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

  const name = getDisplayNameFromClerkUser(user);
  const email = getEmailFromClerkUser(user);

  await syncUserToDatabase({
    clerkId: user.id,
    email,
    displayName: name,
  });

  return {
    id: user.id,
    name,
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
