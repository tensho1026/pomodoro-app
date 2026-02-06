import { ArrowRight, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { signInMockClerkAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-12">
      <div className="grid w-full gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Pomodoro Log
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            記録を残して、毎日の集中量を可視化
          </h1>
          <p className="text-sm text-muted">
            Clerk連携前のモックログイン画面です。UI・遷移・認証フローを先に実装しています。
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              ログイン
            </CardTitle>
            <CardDescription>
              本番では Clerk を利用する想定です（現状はモック）。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signInMockClerkAction}>
              <Button type="submit" className="w-full justify-between">
                Mock Clerk で続行
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
