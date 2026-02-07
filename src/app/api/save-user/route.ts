import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function resolveDisplayName(user: Awaited<ReturnType<typeof currentUser>>) {
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

export async function POST() {
  if (!prisma) {
    return NextResponse.json(
      { message: "DATABASE_URL is not configured." },
      { status: 503 },
    );
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    `${user.id}@clerk.local`;

  const displayName = resolveDisplayName(user);

  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
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

  return NextResponse.json({
    ok: true,
    user: {
      id: dbUser.id,
      clerkId: dbUser.clerkId,
      email: dbUser.email,
      displayName: dbUser.displayName,
    },
  });
}
