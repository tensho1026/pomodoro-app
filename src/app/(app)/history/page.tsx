import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { HistoryList } from "@/components/pomodoro/history-list";
import { getHistoryViewModel } from "@/lib/pomodoro/service";

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const history = await getHistoryViewModel(userId);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">履歴</h1>
        <p className="text-sm text-muted">
          日付ごとの記録詳細と、その日の合計セット数・分数を確認できます。
        </p>
      </section>

      <HistoryList history={history} />
    </div>
  );
}
