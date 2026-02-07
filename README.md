# Pomodoro Log

ポモドーロの記録アプリです。以下を記録・可視化できます。

- 1セットの分数
- 完了したセット数
- タイトルとメモ
- 日別の合計分数 / セット数
- 1日平均の集中時間
- 過去日の詳細セッション

## Tech Stack

- Next.js (App Router)
- Server Actions
- Clerk (認証)
- Prisma (スキーマ定義済み、接続は後段階)
- shadcnベースのUIコンポーネント
- Tailwind CSS

## Local Development

```bash
npm install
npm run dev
```

### Clerk 環境変数

`.env.local` に以下を設定してください。

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## ルーティング

- `/` ダッシュボード
- `/record` 記録作成
- `/history` 日別履歴
- `/analytics` 集計分析
- `/sign-in` ログイン
- `/sign-up` 新規登録

## データ保存について

記録データは Prisma 経由でデータベースへ保存・取得します。

事前にマイグレーションと Prisma Client 生成を実行してください。

```bash
npx prisma migrate deploy
npx prisma generate
```

## CI

`.github/workflows/ci.yml` で次を実行します。

- `npm run lint`
- `npm run build`
