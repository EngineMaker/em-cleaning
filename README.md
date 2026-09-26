# em-cleaning

EngineMaker のシェアハウス向けの掃除管理 DX です。複数のハウスについて、住人の入居・退居・部屋移動と、「いつ・誰が・どこを掃除したか」の記録を、Google フォームと Google スプレッドシートで管理します。

## しくみ

```
住人 / 管理者
   │  回答
   ▼
Google フォーム ──送信トリガー──▶ Google Apps Script ──書き込み──▶ Google スプレッドシート
   ▲                                   │
   └──────── 選択肢を同期（sync） ◀────┘
```

- **掃除記録フォーム**（住人が使う）: ハウス、掃除した日、部屋（ドミトリーの場合は住人）、掃除した場所を送信します。同じ掃除回（月単位）ですでに他の人が担当した場所や、自分が最近担当した場所には警告を出す想定です。
- **住人イベントフォーム**（管理者が使う）: 入居・退居・部屋移動を登録します。
- **スプレッドシート**: ハウス・住人・部屋・居住履歴・掃除場所・掃除記録・ログをシートごとに持ち、DB として使います。
- **GAS**: フォームの送信を受けてシートを更新し（`log`）、シートの内容をフォームの選択肢に反映します（`sync`）。

用語、シートの列、フォームの質問項目は [docs/spec.md](docs/spec.md) にまとめています。

## ディレクトリ構成

| パス | 内容 |
| :--- | :--- |
| `apps/gas-resident` | 住人管理の GAS プロジェクト（住人イベントフォーム） |
| `apps/gas-cleaning` | 掃除管理の GAS プロジェクト（掃除記録フォーム） |
| `packages/resident-core` | 住人・部屋・居住履歴の型と判定ロジック（Google のサービスに依存しない） |
| `packages/cleaning-core` | 掃除場所・掃除記録の型と判定ロジック（Google のサービスに依存しない） |
| `docs/spec.md` | 仕様書 |
| `docs/runbook.md` | 運用手順書（セットアップ、デプロイ、日常運用、トラブル対応） |
| `.github/workflows` | デプロイと Discord 通知 |

## 現状

作りかけです。`packages/*-core` の判定ロジックはありますが、`apps/gas-*` のフォーム連携（`onFormSubmit`、`syncDataToForms` など）はまだ TODO のひな形です。

## 開発

Node.js 20 以上が必要です。

```sh
npm install
npm run login              # clasp で Google アカウントにログイン
```

各 GAS プロジェクトの `.clasp.json.example` を `.clasp.json` にコピーし、`scriptId` を書き換えます。シートとフォームの ID は `.env.example` を参考にします。

```sh
npm run deploy:resident    # 住人管理の GAS に push
npm run deploy:cleaning    # 掃除管理の GAS に push
npm run deploy             # 両方
```

## デプロイ

`main` に push すると、GitHub Actions（`.github/workflows/deploy.yml`）が clasp で両方の GAS に push します。必要な Secret は [docs/runbook.md](docs/runbook.md) を見てください。

デプロイが失敗すると、個人 Discord の #alert に通知が届きます。直前に失敗していたデプロイが次に成功した場合は、復旧の通知が届きます。通知経路が生きているかは、Actions 画面の「Notify test」→「Run workflow」で確かめられます。通知には Secret `DISCORD_ALERT_WEBHOOK_URL` と Variable `DISCORD_USER_ID` を使います。
