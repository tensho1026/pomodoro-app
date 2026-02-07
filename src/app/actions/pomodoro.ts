"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { CreateSessionState } from "@/app/actions/pomodoro-state";
import { createPomodoroSession } from "@/lib/pomodoro/repository";
import { syncClerkUserToDatabase } from "@/lib/user-sync";

const createSessionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください。")
    .max(80, "タイトルは80文字以内で入力してください。"),
  note: z
    .string()
    .trim()
    .max(300, "メモは300文字以内で入力してください。")
    .optional()
    .default(""),
  minutesPerSet: z.coerce
    .number()
    .int("整数で入力してください。")
    .min(5, "1セットは5分以上にしてください。")
    .max(90, "1セットは90分以下にしてください。"),
  setCount: z.coerce
    .number()
    .int("整数で入力してください。")
    .min(1, "セット数は1以上で入力してください。")
    .max(20, "セット数は20以下で入力してください。"),
  startedAt: z.string().trim().optional(),
});

function normalizeStartedAt(rawStartedAt?: string) {
  if (!rawStartedAt) {
    return new Date().toISOString();
  }

  const parsed = new Date(rawStartedAt);

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

export async function createPomodoroSessionAction(
  _previousState: CreateSessionState,
  formData: FormData,
): Promise<CreateSessionState> {
  const { userId } = await auth();

  if (!userId) {
    return {
      status: "error",
      message: "セッションが切れました。再ログインしてください。",
    };
  }

  const clerkUser = await currentUser();
  await syncClerkUserToDatabase(clerkUser);

  const parsed = createSessionSchema.safeParse({
    title: formData.get("title"),
    note: formData.get("note"),
    minutesPerSet: formData.get("minutesPerSet"),
    setCount: formData.get("setCount"),
    startedAt: formData.get("startedAt"),
  });

  if (!parsed.success) {
    const fields = parsed.error.flatten().fieldErrors;

    return {
      status: "error",
      message: "入力内容を確認してください。",
      errors: {
        title: fields.title?.[0],
        note: fields.note?.[0],
        minutesPerSet: fields.minutesPerSet?.[0],
        setCount: fields.setCount?.[0],
      },
    };
  }

  await createPomodoroSession({
    userId,
    title: parsed.data.title,
    note: parsed.data.note,
    minutesPerSet: parsed.data.minutesPerSet,
    setCount: parsed.data.setCount,
    startedAt: normalizeStartedAt(parsed.data.startedAt),
  });

  revalidatePath("/");
  revalidatePath("/record");
  revalidatePath("/history");
  revalidatePath("/analytics");

  return {
    status: "success",
    message: "ポモドーロを記録しました。",
  };
}
