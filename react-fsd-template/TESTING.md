# テスト方針

このプロジェクトでは、テスティングトロフィーを基準にテストの費用対効果を判断する。

```text
                         E2E
              実ブラウザで主要導線を確認する
             ───────────────────────
                      Integration
        UI・フォーム・APIなどの連携を最も厚く確認する
       ─────────────────────────────
                         Unit
          純粋関数や複雑な条件分岐を個別に確認する
      ───────────────────────────────
                   Static Analysis
       TypeScript・Oxlint・buildで常にコード全体を確認する
```

上に行くほど実際の利用方法に近い検証になる一方、実行時間と保守コストが高くなる。そのため、各層を同じ件数にするのではなく、Integration Testを中心に配分する。

| 層 | 主な目的 | このプロジェクトでの対象 | 配分 |
| --- | --- | --- | --- |
| Static Analysis | 型や構文上の問題を素早く検出する | TypeScript、Oxlint、本番build | すべてのコードへ常時適用 |
| Unit Test | 小さなロジックの入力と出力を確認する | Zodスキーマ、エラーメッセージ変換 | 意味のある条件分岐だけ |
| Integration Test | 複数モジュールが接続された振る舞いを確認する | ログイン画面、フォーム、API、Snackbar | 最も厚くする |
| E2E Test | 利用者の主要操作がブラウザ上で完了することを確認する | ホームからログイン成功まで | 重要な導線だけ少数 |

今回のログイン機能では、次のように役割を分ける。

- Static Analysisで、型の不一致、未使用コード、不正なimportを検出する。
- Unit Testで、メールアドレスの検証やエラー変換の条件分岐を確認する。
- Integration Testで、入力、バリデーション、API通信、成功表示、エラー通知をまとめて確認する。
- E2E Testで、ホーム画面からログイン完了までを実際のブラウザで確認する。

## 実行方法

```bash
# Static Analysis
npm run lint
npm run build

# Unit・Integration Test
npm test
npm run test:watch

# E2E Test
npm run test:e2e
```

初回のE2E実行前には、PlaywrightのChromiumをインストールする。

```bash
npx playwright install chromium
```

## テスト範囲

### Static Analysis

TypeScript、oxlint、本番buildによって、型の不一致、importミス、未使用コードなどを検出する。

### Unit Test

外部通信やReactに依存しない純粋なロジックを対象にする。

- Zodスキーマ
- エラーメッセージ変換
- 計算、変換、複雑な条件判定

型定義、単純な定数、MUI自体の振る舞いはテストしない。

### Integration Test

利用者から見た振る舞いを、実際のコンポーネントとモジュールを組み合わせて検証する。ここを最も厚くする。

ログイン画面では、`login()`を関数モックへ置き換えず、次の範囲をまとめて通す。

```text
LoginPage
  → React Hook Form
  → Zod
  → login()
  → apiClient
  → Axios Mock Adapter
  → 成功表示・共通Snackbar
```

開発用の`login.mock.ts`を再利用し、テスト終了時にAxios Mock Adapterを必ず解除する。

### E2E Test

ブラウザ、ルーティング、画面、APIモックを含む主要なユーザー導線だけを検証する。網羅性はIntegration Testで確保し、E2Eの件数は増やしすぎない。

現在は、ホーム画面からログイン画面へ移動してログインに成功する導線を対象とする。

## 追加判断

次のいずれかに該当する場合にテストを追加する。

- 認証や決済など、失敗時の影響が大きい
- 条件分岐やデータ変換が複雑
- 複数箇所から利用される
- 過去に不具合が発生した
- 手動確認に時間がかかる

実装の内部構造ではなく、利用者から見た振る舞いを優先して検証する。
