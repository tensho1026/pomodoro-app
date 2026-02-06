"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  createPomodoroSessionAction,
  initialCreateSessionState,
} from "@/app/actions/pomodoro";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type RecordFormProps = {
  defaultMinutesPerSet?: number;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "保存中..." : "記録する"}
    </Button>
  );
}

export function RecordForm({ defaultMinutesPerSet = 25 }: RecordFormProps) {
  const [state, formAction] = useActionState(
    createPomodoroSessionAction,
    initialCreateSessionState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  const defaultStartedAt = useMemo(() => {
    const now = new Date();
    const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
    return localNow.toISOString().slice(0, 16);
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ポモドーロを記録</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              name="title"
              placeholder="例: 英単語の復習"
              required
              maxLength={80}
            />
            {state.errors?.title ? (
              <p className="text-xs text-red-600">{state.errors.title}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minutesPerSet">1セットの分数</Label>
              <Input
                id="minutesPerSet"
                name="minutesPerSet"
                type="number"
                min={5}
                max={90}
                defaultValue={defaultMinutesPerSet}
                required
              />
              {state.errors?.minutesPerSet ? (
                <p className="text-xs text-red-600">{state.errors.minutesPerSet}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="setCount">完了セット数</Label>
              <Input
                id="setCount"
                name="setCount"
                type="number"
                min={1}
                max={20}
                defaultValue={1}
                required
              />
              {state.errors?.setCount ? (
                <p className="text-xs text-red-600">{state.errors.setCount}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startedAt">開始時刻</Label>
            <Input
              id="startedAt"
              name="startedAt"
              type="datetime-local"
              defaultValue={defaultStartedAt}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">メモ</Label>
            <Textarea
              id="note"
              name="note"
              maxLength={300}
              placeholder="例: 第3章の要点をノートに整理"
            />
            {state.errors?.note ? (
              <p className="text-xs text-red-600">{state.errors.note}</p>
            ) : null}
          </div>

          {state.status !== "idle" ? (
            <p
              className={
                state.status === "success"
                  ? "text-sm text-emerald-600"
                  : "text-sm text-red-600"
              }
            >
              {state.message}
            </p>
          ) : null}

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
