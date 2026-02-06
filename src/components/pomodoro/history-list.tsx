import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMinutes, formatSets } from "@/lib/pomodoro/format";
import type { DaySummary } from "@/lib/pomodoro/types";

import { SessionTable } from "@/components/pomodoro/session-table";

type HistoryListProps = {
  history: DaySummary[];
};

export function HistoryList({ history }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
        記録を追加すると、日別の詳細がここに表示されます。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((day) => (
        <Card key={day.dateKey}>
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
              <span>{day.dateLabel}</span>
              <span className="text-sm font-medium text-muted">
                {formatMinutes(day.totalMinutes)} / {formatSets(day.totalSets)} / {day.sessionCount}件
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SessionTable sessions={day.sessions} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
