# フロントエンド開発規約

## Feature-Sliced Design

## FSDについて

本プロジェクトでは、フロントエンドのコード構成に **Feature-Sliced Design（FSD）** を採用する。

FSDは、フロントエンドのコードを責務ごとに **Layer・Slice・Segment** へ分割し、コードの責任範囲と依存関係を明確にするための設計方法論である。

FSDを採用することで、以下を実現する。

- コードの配置場所を明確にする
- 機能やドメインごとの責務を明確にする
- モジュール間の依存関係を制御する
- 変更による影響範囲を限定する
- プロジェクト規模が大きくなっても構造を把握しやすくする

FSDでは、アプリケーションを以下のLayerに分割する。

```text
app
 ↓
pages
 ↓
widgets
 ↓
features
 ↓
entities
 ↓
shared
```

上位になるほどアプリケーション固有の責務を持ち、下位になるほど汎用的な責務を持つ。

各Layerの概要は以下となる。

```text
app
→ アプリケーション全体の構成・初期化

pages
→ 画面

widgets
→ 複数の要素を組み合わせた共通UI

features
→ 業務上の操作

entities
→ 業務上の概念・ドメイン

shared
→ 業務ドメインに依存しない汎用処理・UI
```

Layer間の依存は、**上位Layerから下位Layerへの方向のみ許可する。**

例えば `pages` は、自分より下位に存在するLayerを直接利用できる。

```text
pages → widgets     OK
pages → features    OK
pages → entities    OK
pages → shared      OK

features → entities OK
features → shared   OK

entities → shared   OK
```

隣接するLayerを経由する必要はない。

```text
pages → entities
pages → shared
features → shared
```

のように、複数Layerを飛ばした依存も許可する。

一方、下位Layerから上位Layerへの依存は禁止する。

```text
entities → features   NG
features → pages      NG
shared → entities     NG
```

依存方向を一方向に制限することで、下位Layerが上位Layerの都合に左右されることを防ぎ、変更容易性と再利用性を維持する。

---

## Layerの役割

本プロジェクトでは以下のLayerを使用する。

```text
src/
├─ app/
├─ pages/
├─ widgets/
├─ features/
├─ entities/
└─ shared/
```

### app

`app` は、**アプリケーション全体の構成・初期化**を担当するLayerである。

特定の画面や業務機能ではなく、アプリケーションそのものを動作させるために必要な設定や構成を配置する。

基本構成は以下とする。

```text
app/
├─ routes/
├─ providers/
├─ layouts/
└─ styles/
```

必要のないフォルダは事前に作成せず、必要になった段階で追加する。

#### routes

アプリケーション全体のルーティング設定を `app/routes` に配置する。

URLとPageの対応関係やLayoutとの関連を定義し、次の規約に従う。

- ルーターのProviderは `app.tsx` に配置し、アプリケーション全体を `BrowserRouter` で囲む。
- URLとPageの対応関係は `routes/app-routes.tsx` に集約する。
- ルートとして表示する画面は `pages` に配置し、各SliceのPublic API（`index.ts`）から参照する。
- アプリ内の画面遷移には、ページ全体を再読み込みしない `Link` または `NavLink` を使用する。
- 定義されていないURLは `path="*"` でNotFound画面へフォールバックする。

```text
app/
├─ app.tsx
└─ routes/
   └─ app-routes.tsx
```

```tsx
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/form-validation" element={<FormValidationPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
```

Pageそのものは `pages` に配置し、`routes` ではそれらを組み合わせてアプリケーションの画面遷移を定義する。

現在定義しているルートは以下の通り。

| パス               | Page                 |
| ------------------ | -------------------- |
| `/`                | `HomePage`           |
| `/about`           | `AboutPage`          |
| `/form-validation` | `FormValidationPage` |
| `*`                | `NotFoundPage`       |

#### providers

アプリケーション全体へ適用するProviderを配置する。

```text
app/
└─ providers/
   ├─ app-providers.tsx
   └─ index.ts
```

例えば以下が対象となる。

- React Query
- Theme
- 認証Context
- アプリケーション全体で使用する状態管理
- その他アプリケーション全体を囲むProvider

複数のProviderを使用する場合は、`AppProviders` などでまとめて管理。

```tsx
export const AppProviders = ({ children }: Props) => {
  return <ErrorNotificationProvider>{children}</ErrorNotificationProvider>;
};
```

特定のPageやFeatureでしか使用しないProviderは `app` に配置しない。

#### layouts

複数のPageで共通する画面構造を配置する。

```text
app/
└─ layouts/
   ├─ AppLayout.tsx
   └─ AuthLayout.tsx
```

例えば以下のような構造をLayoutとして定義する。

```text
AppLayout
├─ Header
├─ Sidebar
└─ Outlet
```

```tsx
export const AppLayout = () => {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>
    </>
  );
};
```

HeaderやSidebarそのものは `widgets` に配置し、Layoutではそれらを組み合わせてアプリケーション全体の画面構造を定義する。

ログイン前後などで画面構造が異なる場合は、用途に応じてLayoutを分割してよい。

```text
layouts/
├─ AppLayout.tsx
└─ AuthLayout.tsx
```

#### styles

アプリケーション全体に適用するStyleを配置する。

```text
app/
└─ styles/
   ├─ global.css
   └─ reset.css
```

例えば以下を配置する。

- Global CSS
- Reset CSS
- 全体に適用するTypography設定
- アプリケーション全体の基本Style

特定のComponentやPageでしか使用しないStyleは、そのComponentやPageの近くに配置する。

#### appに配置しないもの

`app` はアプリケーション全体を構成するLayerであり、業務ドメインや特定画面の実装を配置する場所ではない。

```text
User型
→ entities

User検索処理
→ pages / features

User一覧画面
→ pages

Header
→ widgets

汎用Button
→ shared

共通API Client
→ shared/api
```

`app` には、**アプリケーション全体を起動・構成・接続するためのコード**を配置する。

---

### pages

`pages` は、**ルーティングされる画面単位のコード**を配置するLayerである。

```text
pages/
└─ users/
   ├─ ui/
   │  ├─ UsersPage.tsx
   │  ├─ UserSearchForm.tsx
   │  ├─ UserTable.tsx
   │  └─ UserDetailDialog.tsx
   ├─ model/
   ├─ api/
   └─ index.ts
```

Page内でのみ利用するUI・状態・API処理などを配置できる。

例えば以下がUsers画面でしか使用されない場合は、Page内に配置する。

- User検索フォーム
- User一覧テーブル
- 検索条件
- Page専用API
- Page専用Hooks
- Page専用Dialog

本プロジェクトでは、**Pageを比較的厚くすることを許容する。**

ドメイン知識を持っているという理由だけで、最初から `features` や `entities` へ分割しない。

---

### widgets

`widgets` は、**複数の下位Layerを組み合わせた、まとまりのあるUIブロック**を配置するLayerである。

代表例としてHeaderやSidebarなどがある。

```text
widgets/
├─ header/
└─ sidebar/
```

例えばHeaderは、以下のように下位Layerの要素を組み合わせて構成できる。

```text
Header
├─ Logo
├─ Navigation
├─ UserAvatar
└─ LogoutButton
```

```text
UserAvatar
→ entities/user

LogoutButton
→ features/logout

Header
→ widgets/header
```

単にサイズが大きいコンポーネントだからWidgetにするのではない。

**複数Pageから利用される、意味のあるUIブロックであること**を判断基準とする。

1つのPageでしか使用しないUIは、大きなコンポーネントであってもPage内に配置してよい。

---

### features

`features` は、**ユーザーが行う業務上の操作**を表現するLayerである。

基本的には **業務上の動詞** と考える。

```text
Search User
Update User
Login
Logout
Add Product To Cart
```

例えばUser検索機能であれば、以下のような構成になる。

```text
features/
└─ search-user/
   ├─ ui/
   │  └─ UserSearchForm.tsx
   ├─ model/
   ├─ api/
   └─ index.ts
```

例えば以下のような操作がFeatureの候補となる。

```text
Userを検索する
Userを更新する
商品をカートに追加する
```

ただし、操作であるという理由だけですべてをFeature化しない。

```text
sort-user
select-user
open-user-dialog
close-user-dialog
change-user-filter
```

のように細かく分割するとSliceが増えすぎる。

独立した機能として切り出す価値があるものだけをFeatureとする。

---

### entities

`entities` は、**業務ドメインそのもの**を表現するLayerである。

基本的には **業務上の名詞** と考える。

```text
User
Product
Order
Customer
Project
```

Userであれば、以下のような構成になる。

```text
entities/
└─ user/
   ├─ ui/
   │  ├─ UserAvatar.tsx
   │  └─ UserCard.tsx
   ├─ model/
   │  └─ types.ts
   ├─ api/
   └─ index.ts
```

Entity内部の役割は、例えば以下のように考える。

```text
model
→ Userとは何か

ui
→ Userをどう表示するか

api
→ Userをどう取得するか
```

```ts
type User = {
  id: string;
  name: string;
  email: string;
};
```

のようなドメイン情報や、

```tsx
<UserAvatar user={user} />
<UserCard user={user} />
```

のようなEntityそのものを表現するUIを配置できる。

一方、

```text
Userを検索する
Userを更新する
Userを削除する
```

といった操作はEntityではなく、PageまたはFeatureの責務となる。

---

### shared

`shared` は、**業務ドメインに依存しない汎用的なコード**を配置するLayerである。

```text
shared/
├─ ui/
├─ api/
├─ lib/
└─ config/
```

`shared/ui` には、例えば以下のような汎用コンポーネントを配置する。

```text
shared/ui/
├─ button/
├─ text-field/
├─ select/
├─ modal/
├─ search-input/
├─ date-picker/
└─ data-table/
```

配置例は以下となる。

```text
Button
TextField
SearchInput
Modal
Pagination
DataTable
```

例えば、

```tsx
<SearchInput value={keyword} onChange={setKeyword} onSearch={handleSearch} />
```

が `User`、`Product`、`Order` などの業務知識を持たないのであれば、`shared/ui` に配置できる。

一方、

```text
UserSearchForm
OrderTable
ProductCard
```

のように業務ドメインを持つものはSharedには配置しない。

Sharedへ配置する場合は、以下を判断基準とする。

- 業務ドメインを知らなくても成立する
- 複数箇所で利用する価値がある
- UIや振る舞いを統一する価値がある

迷った場合は、**別の業務システムへそのまま持っていっても成立するか**を判断基準の一つとする。

---

## SliceとSegment

FSDでは、Layerの内部をさらにSliceとSegmentに分割する。

```text
Layer
└─ Slice
   └─ Segment
```

### Slice

Sliceは、**Layer内部を業務・機能単位で分割する単位**である。

例えば、

```text
entities/
└─ user/
   ├─ ui/
   ├─ model/
   └─ api/
```

では、`user` がSliceとなる。

同様に、

```text
pages/users
widgets/header
features/search-user
entities/user
```

の、

```text
users
header
search-user
user
```

がそれぞれSliceとなる。

Sliceを持つLayerは以下とする。

```text
pages
widgets
features
entities
```

`app` と `shared` はSliceを持たない。

```text
app/
├─ routes/
├─ providers/
├─ layouts/
└─ styles/

shared/
├─ ui/
├─ api/
├─ lib/
└─ config/
```

---

### Segment

Segmentは、**Slice内部のコードを技術的な役割によって分類する単位**である。

本プロジェクトでは主に以下を使用する。

```text
ui
model
api
lib
config
```

#### ui

UIコンポーネントや表示ロジックを配置する。

```text
ui/
├─ UserCard.tsx
└─ UserAvatar.tsx
```

#### model

型・状態・バリデーション・ドメインロジックなどを配置する。

```text
model/
├─ types.ts
├─ schema.ts
└─ store.ts
```

##### Zodによるバリデーション

入力値の検証にはZodを使用する。

- スキーマは検証対象を利用するSliceの `model` に配置する。
- 複数のSliceで共有するスキーマだけを `shared` へ移動する。
- TypeScriptの型はスキーマと重複して定義せず、`z.infer` から生成する。
- ユーザー入力など、実行時には保証されない値を利用する前に `safeParse` で検証する。
- React Hook Formでは `zodResolver` を使用し、フォームの値とエラーを一元管理する。
- MUIのフォームコンポーネントは `Controller` で接続し、値変更時の処理を拡張できる形に統一する。
- エラーメッセージは `fieldState.error` から取得し、入力項目と関連付けて表示する。

```ts
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.email("Enter a valid email address."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
```

```ts
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const { control, handleSubmit, formState: { isValid } } = useForm<ContactFormValues>({
  resolver: zodResolver(contactFormSchema),
  defaultValues: contactFormDefaultValues,
  mode: "onChange",
});

<form onSubmit={handleSubmit(onSubmit)}>
  <Controller
    name="name"
    control={control}
    render={({ field, fieldState }) => (
      <TextField
        {...field}
        error={Boolean(fieldState.error)}
        helperText={fieldState.error?.message}
      />
    )}
  />
  <Button type="submit" disabled={!isValid}>Submit</Button>
</form>;
```

#### api

API通信に関する処理を配置する。アプリケーション共通のAxiosクライアントは `shared/api` で管理する。

```text
shared/
└─ api/
   ├─ api-client.ts
   ├─ api-error.ts
   └─ index.ts
```

Axiosクライアントは次の規約に従う。

- API通信ではグローバルな `axios` を直接使用せず、`apiClient` を使用する。
- Base URLはモード別の `.env.development` と `.env.production` で `VITE_API_BASE_URL` を設定する。
- 環境変数の型は `src/vite-env.d.ts` の `ImportMetaEnv` に定義する。
- timeout、共通headers、interceptorは `api-client.ts` に集約する。
- 今回は、Cookieセッション認証を採用し、`withCredentials: true` でCookieをリクエストに含める。
- response interceptorでAxiosエラーを `ApiError` へ変換する。
- FormDataなどJSON以外を送信する場合は、リクエスト単位で `Content-Type` を上書きする。
- 個別API関数とrequest / response型は、利用するPage・Feature・Entityの `api` Segmentに配置する。

`shared/api` の責務は、特定の業務ドメインに依存しない通信基盤に限定する。

| `shared/api` に置く | 各Sliceの `api` に置く |
| --- | --- |
| Axiosクライアントと共通設定 | エンドポイントのパス |
| request / response interceptor | 個別のAPI関数 |
| 共通エラー型 | 業務固有のrequest / response型 |

`User`、`Order`、`LoginResult` などの業務固有型や、`/users` などのエンドポイントを `shared/api` に置かない。

開発環境:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

本番環境:

```env
VITE_API_BASE_URL=/api
```

##### Featureからの利用例

Featureの `api` Segmentから `shared/api` のクライアントを利用する。

```text
features/
└─ login/
   ├─ api/
   │  └─ login.ts
   └─ index.ts
```

```ts
// features/login/api/login.ts
import { apiClient } from "@shared/api";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResult = {
  id: string;
  name: string;
};

export const login = async (input: LoginRequest): Promise<LoginResult> => {
  const response = await apiClient.post<LoginResult>("/auth/login", input);

  return response.data;
};
```

Feature外へ公開するAPIはSlice直下のPublic APIへ追加する。

```ts
// features/login/index.ts
export { login } from "./api/login";
```

利用側は `shared/api` やFeature内部を直接参照せず、FeatureのPublic APIを使用する。

```ts
import { login } from "@features/login";

const handleLogin = async () => {
  const user = await login({
    email: "user@example.com",
    password: "password",
  });

  return user;
};
```

##### 共通エラーハンドリング

エラー表示は画面ごとに文言やUIを実装せず、共通エラーハンドリングを使用する。

- Axiosの通信エラーはresponse interceptorで `ApiError` へ変換する。
- ユーザー向けメッセージは `getErrorMessage` でHTTPステータスやエラーコードから決定する。
- URLに対応する画面が存在しない場合のみ `NotFoundPage` を表示する。
- その他のエラーは `useErrorNotification` から画面右上のSnackbarへ通知する。
- APIレスポンスの詳細やサーバー内部のメッセージを、そのままユーザーへ表示しない。
- 画面固有の復旧操作が必要な場合のみ、PageまたはFeatureで個別に処理する。

```ts
import { useErrorNotification } from "@shared/lib/error";
import { apiClient } from "@shared/api";

export const Example = () => {
  const { notifyError } = useErrorNotification();

  const handleClick = async () => {
    try {
      await apiClient.get("/example");
    } catch (error) {
      notifyError(error);
    }
  };

  return <button onClick={handleClick}>APIを呼び出す</button>;
};
```

#### lib

そのSlice内部で利用する補助処理を配置する。

```text
lib/
└─ formatUserName.ts
```

#### config

そのSliceや機能に関する設定を配置する。

すべてのSliceにすべてのSegmentを作成する必要はない。

**必要なSegmentのみ作成する。**

---

## 開発の基本方針

### Pageを起点に実装する

新しい画面を開発するときは、まずPage Slice内に実装する。

```text
pages/
└─ users/
   ├─ ui/
   │  ├─ UsersPage.tsx
   │  ├─ UserSearchForm.tsx
   │  └─ UserTable.tsx
   ├─ model/
   └─ api/
```

そのPageでしか使用しないコードは、原則としてPage内に残す。

例えば、

```text
UserSearchForm
UserTable
UserDetailDialog
```

がUsersPageでしか利用されないのであれば、FeatureやEntityへ無理に移動しない。

開発を進める中で複数Pageから利用されるようになった場合に、責務に応じて下位Layerへの抽出を検討する。

```text
Page専用
    ↓
pages

再利用される
    ↓
責務を確認
    ↓
widgets / features / entities / shared
```

抽出先は以下を基本とする。

```text
複数Pageで利用する大きなUI
→ widgets

再利用可能な業務上の操作
→ features

再利用可能な業務ドメイン
→ entities

業務ドメインを持たない汎用コード
→ shared
```

ただし、再利用されたという理由だけで必ず抽出するわけではない。

以下も考慮する。

- 責務が明確か
- 独立した機能として意味があるか
- 抽出することで理解しやすくなるか
- Sliceが細かくなりすぎないか

---

## 依存とImportのルール

### 同一Slice内の依存

同一Slice内部では、Segment間や同一Segment内での依存を許可する。

例えば、

```text
entities/user/
├─ ui/
│  ├─ UserCard.tsx
│  └─ UserAvatar.tsx
└─ model/
   └─ types.ts
```

`UserCard.tsx` から以下のように参照してよい。

```tsx
import { UserAvatar } from "./UserAvatar";
import type { User } from "../model/types";
```

同じSlice内部であれば、

```text
ui → ui      OK
ui → model   OK
ui → api     OK
model → api  OK
```

などの依存を許可する。

FSDの依存制約は、Segment間ではなく、主に **LayerとSliceの境界** で考える。

---

### 同一LayerのSlice間依存

同じLayerに存在する別Sliceへの依存は原則として禁止する。

```text
features/search-user
        ↓
features/update-user
```

のような依存は行わない。

Entityも同様とする。

```text
entities/order
        ↓
entities/user
```

のような直接依存は原則として行わない。

Entity間の依存が避けられない場合は、個別に設計を検討する。

---

### Public API

Slice外部からSlice内部へ直接アクセスしない。

```text
features/
└─ search-user/
   ├─ ui/
   │  └─ UserSearchForm.tsx
   └─ index.ts
```

Slice外部へ公開するものは `index.ts` で定義する。

```ts
export { UserSearchForm } from "./ui/UserSearchForm";
```

利用側はPublic APIからimportする。

```ts
import { UserSearchForm } from "@/features/search-user";
```

以下のようなDeep Importは行わない。

```ts
import { UserSearchForm } from "@/features/search-user/ui/UserSearchForm";
```

Public APIは、**Slice外部に何を公開するかを定義する境界**として扱う。

一方、同じSlice内部ではPublic APIを経由せず、相対importを使用する。

```ts
import { UserAvatar } from "./UserAvatar";
```

---

## ファイル配置と命名

### Page内のUI

Page Slice内のUIは、原則として `ui/` 直下へフラットに配置する。

```text
pages/
└─ users/
   └─ ui/
      ├─ UsersPage.tsx
      ├─ UserSearchForm.tsx
      ├─ UserTable.tsx
      └─ UserDetailDialog.tsx
```

以下のように、1ファイルだけのフォルダをコンポーネントごとに作成することは避ける。

```text
ui/
├─ search/
│  └─ UserSearchForm.tsx
├─ table/
│  └─ UserTable.tsx
└─ detail/
   └─ UserDetailDialog.tsx
```

コンポーネント専用の関連ファイルが複数存在する場合のみ、専用フォルダへの分割を検討する。

```text
ui/
├─ UsersPage.tsx
├─ UserTable.tsx
└─ UserSearchForm/
   ├─ UserSearchForm.tsx
   ├─ UserSearchFields.tsx
   └─ UserSearchForm.test.tsx
```

---

### Pageコンポーネントの命名

Page Sliceのルートコンポーネントには、

```text
<Name>Page.tsx
```

の命名規則を使用する。

```text
users
→ UsersPage.tsx

user-detail
→ UserDetailPage.tsx

settings
→ SettingsPage.tsx
```

`Page` suffixは、**Routerから表示されるPage Sliceのルートコンポーネント**であることを表す。

子コンポーネントには `Page` を付けない。

```text
UsersPage.tsx
UserSearchForm.tsx
UserTable.tsx
UserDetailDialog.tsx
```

Page SliceのPublic APIからは、原則としてルートPageのみを公開する。

```ts
export { UsersPage } from "./ui/UsersPage";
```

---

### Assetの配置

`assets` Segmentは原則として作成しない。

画像やSVGなどは、それを利用するコードの近くへ配置する。

Page専用であればPage内に配置する。

```text
pages/
└─ home/
   └─ ui/
      ├─ HomePage.tsx
      └─ hero-image.jpg
```

Entity専用であればEntity内に配置する。

```text
entities/
└─ user/
   └─ ui/
      ├─ UserAvatar.tsx
      └─ default-avatar.png
```

複数箇所から利用する汎用AssetはSharedへ配置する。

```text
shared/
└─ ui/
   └─ icons/
      └─ search.svg
```

グローバルStyleやFontは `app` に配置する。

```text
app/
├─ styles/
└─ fonts/
```

`favicon.ico`、`robots.txt`、manifestなど、ビルド処理せずそのまま配信するファイルは `public/` に配置する。

---

## 避けるべき設計

以下のような設計は行わない。

### 下位Layerから上位Layerへ依存する

```text
entities → features
shared → entities
features → pages
```

### 同一Layerの別Sliceへ直接依存する

```text
features/A → features/B
```

### Slice内部へDeep Importする

```ts
import { Foo } from "@/features/foo/ui/Foo";
```

Slice外部からはPublic APIを使用する。

### Sharedに業務ドメインを持たせる

```text
shared/ui/UserTable
shared/ui/OrderSearchForm
```

のように、業務ドメインを持つコードをSharedへ配置しない。

### Featureを過度に細分化する

```text
features/
├─ open-modal/
├─ close-modal/
├─ change-filter/
└─ select-row/
```

のように細かなUI操作をすべてFeature化しない。

### 将来利用する可能性だけで共通化する

「将来使いそう」という理由だけで `shared`、`features`、`entities` へ抽出しない。

実際に責務や再利用性が明確になってから抽出する。

### 不要なSegmentを作成する

```text
ui/
model/
api/
lib/
config/
```

をテンプレートとして毎回すべて作成しない。

必要なSegmentのみ作成する。

### 不要なフォルダ階層を作成する

1ファイルしか存在しないフォルダを大量に作成せず、必要になるまではフラットな構造を維持する。

---

## 開発時の基本フロー

新しい画面を開発する場合は、以下の流れを基本とする。

```text
Page Sliceを作成
        ↓
必要なSegmentを作成
        ↓
Page内に実装
        ↓
Page内部でComponentを分割
        ↓
開発を継続
        ↓
再利用されるコードが発生
        ↓
責務を確認
        ↓
必要なものだけ下位Layerへ抽出
```

基本的には、

```text
まずPageに置く
      ↓
実装する
      ↓
責務・再利用性が見える
      ↓
必要なものだけ抽出する
```

という流れで開発する。

最初から完成形のFSD構造を設計するのではなく、Pageを起点として実装し、責務や再利用性が明確になった段階で適切なLayerへ抽出する。
