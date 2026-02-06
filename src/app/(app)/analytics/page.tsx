import { AnalyticsChart } from "@/components/pomodoro/analytics-chart";
import { StatsCards } from "@/components/pomodoro/stats-cards";
import { formatMinutes } from "@/lib/pomodoro/format";
import { getCurrentUser } from "@/lib/auth";
import { getAnalyticsViewModel } from "@/lib/pomodoro/service";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const analytics = await getAnalyticsViewModel(user.id);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">分析</h1>
        <p className="text-sm text-muted">
          1日平均やベスト日を見ながら、集中時間の傾向を確認できます。
        </p>
      </section>

      <StatsCards
        cards={[
          {
            title: "1日平均集中時間",
            value: formatMinutes(analytics.averageDailyMinutes),
            description: "記録がある日だけを対象に算出",
          },
          {
            title: "1日平均セット",
            value: `${analytics.averageSetsPerDay}セット`,
            description: "日ごとの平均完了セット数",
          },
          {
            title: "最大集中時間",
            value: formatMinutes(analytics.bestDayMinutes),
            description: "最も集中できた1日の合計",
          },
          {
            title: "分析対象日数",
            value: `${analytics.chartData.length}日`,
            description: "記録が存在する日数",
          },
        ]}
      />

      <AnalyticsChart analytics={analytics} />
    </div>
  );
}
