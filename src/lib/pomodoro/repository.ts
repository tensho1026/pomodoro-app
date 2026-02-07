import type { CreatePomodoroSessionInput, PomodoroSession } from "@/lib/pomodoro/types";
import { prisma } from "@/lib/prisma";

function mapPrismaSessionToDomain(session: {
  id: string;
  title: string;
  note: string | null;
  minutesPerSet: number;
  setCount: number;
  startedAt: Date;
  createdAt: Date;
  userId: string;
}): PomodoroSession {
  return {
    id: session.id,
    userId: session.userId,
    title: session.title,
    note: session.note ?? "",
    minutesPerSet: session.minutesPerSet,
    setCount: session.setCount,
    startedAt: session.startedAt.toISOString(),
    createdAt: session.createdAt.toISOString(),
  };
}

export async function listPomodoroSessionsByUser(
  clerkUserId: string,
): Promise<PomodoroSession[]> {
  if (!prisma) {
    return [];
  }

  const sessions = await prisma.pomodoroSession.findMany({
    where: {
      user: {
        clerkId: clerkUserId,
      },
    },
    orderBy: {
      startedAt: "desc",
    },
  });

  return sessions.map(mapPrismaSessionToDomain);
}

export async function createPomodoroSession(
  input: CreatePomodoroSessionInput,
): Promise<PomodoroSession> {
  if (!prisma) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const created = await prisma.pomodoroSession.create({
    data: {
      title: input.title,
      note: input.note || null,
      minutesPerSet: input.minutesPerSet,
      setCount: input.setCount,
      startedAt: new Date(input.startedAt),
      user: {
        connect: {
          clerkId: input.userId,
        },
      },
    },
  });

  return mapPrismaSessionToDomain(created);
}
