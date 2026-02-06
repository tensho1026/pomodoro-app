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
- Prisma (スキーマ定義済み、接続は後段階)
- shadcnベースのUIコンポーネント
- Tailwind CSS

## Local Development

```bash
npm install
npm run dev
```

`/login` から Mock Clerk ログインを実行すると、アプリ画面へ遷移できます。

## ルーティング

- `/` ダッシュボード
- `/record` 記録作成
- `/history` 日別履歴
- `/analytics` 集計分析
- `/login` ログイン（Mock Clerk）

## データ保存について

現時点では `data/pomodoros.json` へ保存する仮実装です。
将来的に `prisma/schema.prisma` のモデルへ置き換える想定です。

## CI

`.github/workflows/ci.yml` で次を実行します。

- `npm run lint`
- `npm run build`
