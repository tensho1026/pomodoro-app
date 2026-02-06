import { RecordForm } from "@/components/pomodoro/record-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMinutes, formatSets } from "@/lib/pomodoro/format";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardViewModel } from "@/lib/pomodoro/service";

export default async function RecordPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const dashboard = await getDashboardViewModel(user.id);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">記録</h1>
        <p className="text-sm text-muted">
          実行したポモドーロの分数、セット数、メモを保存します。
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <RecordForm />

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">今日のサマリー</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              今日の集中時間: <span className="font-semibold">{formatMinutes(dashboard.todayMinutes)}</span>
            </p>
            <p>
              今日のセット数: <span className="font-semibold">{formatSets(dashboard.todaySets)}</span>
            </p>
            <p>
              累計集中時間: <span className="font-semibold">{formatMinutes(dashboard.totalMinutes)}</span>
            </p>
            <p>
              1日平均: <span className="font-semibold">{formatMinutes(dashboard.averageDailyMinutes)}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
