import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMinutes, formatSets } from "@/lib/pomodoro/format";
import type { AnalyticsViewModel } from "@/lib/pomodoro/types";

type AnalyticsChartProps = {
  analytics: AnalyticsViewModel;
};

export function AnalyticsChart({ analytics }: AnalyticsChartProps) {
  if (analytics.chartData.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
        分析できる記録がまだありません。
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>日別の合計集中時間</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analytics.chartData.map((point) => (
          <div
            key={point.dateKey}
            className="grid grid-cols-[60px_1fr_auto] items-center gap-3"
          >
            <span className="text-xs text-muted">{point.dateLabel}</span>
            <div className="h-3 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${point.ratio}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground">
              {formatMinutes(point.totalMinutes)} / {formatSets(point.totalSets)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
