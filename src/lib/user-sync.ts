import "server-only";

import { prisma } from "@/lib/prisma";

type ClerkUser = {
  id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  primaryEmailAddress?: {
    emailAddress: string;
  } | null;
  emailAddresses: Array<{
    emailAddress: string;
  }>;
};

function resolveDisplayName(user: ClerkUser) {
  if (user.fullName) {
    return user.fullName;
  }

  const combined = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (combined) {
    return combined;
  }

  return user.username ?? "";
}

function resolveEmail(user: ClerkUser) {
  return (
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    `${user.id}@clerk.local`
  );
}

export async function syncClerkUserToDatabase(user: ClerkUser | null) {
  if (!prisma || !user) {
    return null;
  }

  const email = resolveEmail(user);
  const displayName = resolveDisplayName(user);

  return prisma.user.upsert({
    where: {
      clerkId: user.id,
    },
    update: {
      email,
      displayName: displayName || null,
    },
    create: {
      clerkId: user.id,
      email,
      displayName: displayName || null,
    },
  });
}

export function getEmailFromClerkUser(user: ClerkUser | null) {
  if (!user) {
    return "";
  }

  return resolveEmail(user);
}
