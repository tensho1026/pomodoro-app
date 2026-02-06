import { promises as fs } from "node:fs";
import path from "node:path";

import type { CreatePomodoroSessionInput, PomodoroSession } from "@/lib/pomodoro/types";

type PomodoroStore = {
  sessions: PomodoroSession[];
};

const STORE_PATH = path.join(process.cwd(), "data", "pomodoros.json");

let writeQueue: Promise<unknown> = Promise.resolve();

async function ensureStoreExists() {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });

  try {
    await fs.access(STORE_PATH);
  } catch {
    const initialStore: PomodoroStore = { sessions: [] };
    await fs.writeFile(STORE_PATH, JSON.stringify(initialStore, null, 2), "utf-8");
  }
}

async function readStore(): Promise<PomodoroStore> {
  await ensureStoreExists();

  const fileContent = await fs.readFile(STORE_PATH, "utf-8");

  try {
    const parsed = JSON.parse(fileContent) as Partial<PomodoroStore>;
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    };
  } catch {
    return { sessions: [] };
  }
}

async function writeStore(store: PomodoroStore) {
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

function withWriteLock<T>(task: () => Promise<T>): Promise<T> {
  const nextTask = writeQueue.then(task, task);
  writeQueue = nextTask.then(
    () => undefined,
    () => undefined,
  );

  return nextTask;
}

export async function listPomodoroSessionsByUser(
  userId: string,
): Promise<PomodoroSession[]> {
  const store = await readStore();

  return store.sessions
    .filter((session) => session.userId === userId)
    .sort(
      (left, right) =>
        new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime(),
    );
}

export async function createPomodoroSession(
  input: CreatePomodoroSessionInput,
): Promise<PomodoroSession> {
  return withWriteLock(async () => {
    const store = await readStore();

    const newSession: PomodoroSession = {
      id: crypto.randomUUID(),
      userId: input.userId,
      title: input.title,
      note: input.note,
      minutesPerSet: input.minutesPerSet,
      setCount: input.setCount,
      startedAt: input.startedAt,
      createdAt: new Date().toISOString(),
    };

    store.sessions.push(newSession);

    await writeStore(store);

    return newSession;
  });
}
