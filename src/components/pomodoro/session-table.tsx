import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatMinutes,
  formatSessionDateTime,
  formatSets,
} from "@/lib/pomodoro/format";
import type { PomodoroSession } from "@/lib/pomodoro/types";

type SessionTableProps = {
  sessions: PomodoroSession[];
  emptyText?: string;
};

export function SessionTable({
  sessions,
  emptyText = "まだ記録がありません。",
}: SessionTableProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
        {emptyText}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {sessions.map((session) => {
          const totalMinutes = session.minutesPerSet * session.setCount;

          return (
            <div
              key={session.id}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{session.title}</p>
                <Badge variant="secondary">{formatSessionDateTime(session.startedAt)}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted">
                {formatSets(session.setCount)} / {session.minutesPerSet}分
              </p>
              <p className="text-sm text-muted">合計: {formatMinutes(totalMinutes)}</p>
              {session.note ? (
                <p className="mt-2 line-clamp-3 text-sm text-foreground">{session.note}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日時</TableHead>
              <TableHead>タイトル</TableHead>
              <TableHead>セット数</TableHead>
              <TableHead>1セット</TableHead>
              <TableHead>合計</TableHead>
              <TableHead>メモ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => {
              const totalMinutes = session.minutesPerSet * session.setCount;

              return (
                <TableRow key={session.id}>
                  <TableCell className="text-muted">
                    {formatSessionDateTime(session.startedAt)}
                  </TableCell>
                  <TableCell className="font-medium">{session.title}</TableCell>
                  <TableCell>{formatSets(session.setCount)}</TableCell>
                  <TableCell>{formatMinutes(session.minutesPerSet)}</TableCell>
                  <TableCell>{formatMinutes(totalMinutes)}</TableCell>
                  <TableCell className="max-w-[280px] text-muted">
                    <span className="line-clamp-2">{session.note || "-"}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
