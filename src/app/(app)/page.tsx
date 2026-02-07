import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SessionTable } from "@/components/pomodoro/session-table";
import { StatsCards } from "@/components/pomodoro/stats-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMinutes, formatSets } from "@/lib/pomodoro/format";
import { getDashboardViewModel } from "@/lib/pomodoro/service";

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dashboard = await getDashboardViewModel(userId);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">ダッシュボード</h1>
        <p className="text-sm text-muted">
          今日の進捗と累計データをまとめて確認できます。
        </p>
      </section>

      <StatsCards
        cards={[
          {
            title: "今日の集中時間",
            value: formatMinutes(dashboard.todayMinutes),
            description: `今日の完了セット: ${formatSets(dashboard.todaySets)}`,
          },
          {
            title: "1日平均",
            value: formatMinutes(dashboard.averageDailyMinutes),
            description: `${dashboard.activeDays}日分の平均`,
          },
          {
            title: "累計集中時間",
            value: formatMinutes(dashboard.totalMinutes),
            description: `累計 ${formatSets(dashboard.totalSets)}`,
          },
          {
            title: "総記録数",
            value: `${dashboard.totalSessions}件`,
            description: "過去に記録したセッション数",
          },
        ]}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>最近の記録</CardTitle>
          <Button asChild size="sm" variant="outline">
            <Link href="/record">新しく記録</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <SessionTable
            sessions={dashboard.recentSessions}
            emptyText="まだ記録がありません。まずは1件追加してみましょう。"
          />
        </CardContent>
      </Card>
    </div>
  );
}
