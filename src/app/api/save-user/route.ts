import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { syncClerkUserToDatabase } from "@/lib/user-sync";

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

  const dbUser = await syncClerkUserToDatabase(user);

  if (!dbUser) {
    return NextResponse.json(
      { message: "DATABASE_URL is not configured." },
      { status: 503 },
    );
  }

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
