# フロントエンド開発規約

## Feature-Sliced Design

## FSDについて

本プロジェクトでは、フロントエンドのコード構成に **Feature-Sliced Design（FSD）** を採用する。

FSDは、フロントエンドのコードを責務ごとに **Layer・Slice・Segment** へ分割し、コードの責任範囲と依存関係を明確にするための設計方法論である。

本プロジェクトでは、FSDを利用することで以下を実現する。

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

また、Layer間の依存は **上位Layerから下位Layerへの方向のみ許可する**。

```text
pages → widgets     OK
pages → features    OK
pages → entities    OK
pages → shared      OK

features → entities OK
features → shared   OK

entities → shared   OK
```

隣接するLayerを経由する必要はなく、自分より下位のLayerであれば直接依存してよい。

一方、下位Layerから上位Layerへの依存は禁止する。

```text
entities → features   NG
features → pages      NG
shared → entities     NG
```

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

それぞれのLayerは、次の責務を持つ。

### app

アプリケーション全体の構成や初期化を担当する。

```text
app/
├─ routes/
├─ providers/
├─ layouts/
└─ styles/
```

主に以下を配置する。

- Router設定
- Provider
- Theme設定
- アプリケーション初期化処理
- グローバルStyle
- Layout

業務ロジックは原則として配置しない。

HeaderやSidebarなどをアプリケーション全体で使用する場合は、Widgetとして定義したものをLayoutから利用する。

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

### pages

ルーティングされる画面単位のコードを配置する。

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

その画面でしか使用しないUI・状態・API処理などはPage内に配置する。

例えばUser一覧画面専用であれば、以下のようなものもPage内に配置してよい。

- User検索フォーム
- User一覧テーブル
- 検索条件
- Page専用API
- Page専用Hooks
- Page専用Dialog

本プロジェクトではPageを比較的厚くすることを許容する。

### widgets

複数の下位Layerを組み合わせた、まとまりのあるUIブロックを配置する。

代表例として、HeaderやSidebarなどがある。

```text
widgets/
├─ header/
└─ sidebar/
```

例えばHeaderは、以下のような下位Layerの要素を組み合わせて構成できる。

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

単にサイズが大きいコンポーネントだからWidgetにするのではなく、**複数Pageから利用される、意味のあるUIブロックであること**を判断基準とする。

1つのPageでしか使用しない場合は、Page内に配置してよい。

### features

ユーザーが行う業務上の操作を表現する。

Featureは、基本的に **業務上の動詞** と考える。

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

ただし、操作であるという理由だけですべてをFeature化しない。

```text
sort-user
select-user
open-user-dialog
close-user-dialog
change-user-filter
```

のように細かく分割するとSliceが増えすぎるため、独立した機能として切り出す価値があるものだけをFeatureとする。

### entities

業務ドメインそのものを表現する。

Entityは、基本的に **業務上の名詞** と考える。

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

各Segmentの役割は例えば以下となる。

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

のようなEntityを表現するUIを配置できる。

一方、

```text
Userを検索する
Userを更新する
Userを削除する
```

といった操作はEntityではなく、PageまたはFeatureの責務となる。

### shared

業務ドメインに依存しない汎用的なコードを配置する。

```text
shared/
├─ ui/
├─ api/
├─ lib/
└─ config/
```

`shared/ui` には、例えば以下のような汎用コンポーネントを配置する。

```text
Button
TextField
Select
SearchInput
Modal
DatePicker
Pagination
DataTable
```

例えば、

```tsx
<SearchInput value={keyword} onChange={setKeyword} onSearch={handleSearch} />
```

がUserやProductなどの業務知識を持たないのであれば、`shared/ui` に配置できる。

一方、

```text
UserSearchForm
OrderTable
ProductCard
```

のように業務ドメインを持つものはSharedには配置しない。

Sharedへ配置するか迷った場合は、**別の業務システムへそのまま持っていっても成立するか**を一つの判断基準とする。

---

## SliceとSegment

FSDでは、Layerの内部をさらにSliceとSegmentに分割する。

```text
Layer
└─ Slice
   └─ Segment
```

### Slice

Sliceは、Layer内部を業務・機能単位で分割する単位である。

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

の `users`、`header`、`search-user`、`user` がそれぞれSliceとなる。

Sliceを持つLayerは以下とする。

```text
pages
widgets
features
entities
```

`app` と `shared` はSliceを持たず、Layer直下をSegmentや用途別の構造で整理する。

### Segment

Segmentは、Slice内部のコードを技術的な役割によって分類する単位である。

本プロジェクトでは主に以下を使用する。

```text
ui
model
api
lib
config
```

`ui` にはUIコンポーネントや表示ロジックを配置する。

```text
ui/
├─ UserCard.tsx
└─ UserAvatar.tsx
```

`model` には型・状態・バリデーション・ドメインロジックなどを配置する。

```text
model/
├─ types.ts
├─ schema.ts
└─ store.ts
```

`api` にはAPI通信に関する処理を配置する。

```text
api/
├─ getUser.ts
└─ updateUser.ts
```

`lib` には、そのSlice内部で利用する補助処理を配置する。

```text
lib/
└─ formatUserName.ts
```

`config` には、そのSliceや機能に関する設定を配置する。

すべてのSliceにすべてのSegmentを作る必要はない。必要なものだけ作成する。

---

## 開発方針

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

抽出先は次の考え方を基本とする。

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

抽出することで責務が明確になるか、理解しやすくなるか、Sliceが細かくなりすぎないかを考慮する。

---

## 依存とImportのルール

### 同一Slice内

同一Sliceの内部では、Segment間や同一Segment内での依存を許可する。

```text
entities/user/
├─ ui/
│  ├─ UserCard.tsx
│  └─ UserAvatar.tsx
└─ model/
   └─ types.ts
```

例えば `UserCard.tsx` から次のように参照してよい。

```tsx
import { UserAvatar } from "./UserAvatar";
import type { User } from "../model/types";
```

同じSlice内部であれば、

```text
ui → ui
ui → model
ui → api
model → api
```

などの依存は問題ない。

FSDの依存制約は、Segment間ではなく、主にLayerとSliceの境界で考える。

### 同一Layerの別Slice

同じLayerに存在する別Sliceへの依存は原則として禁止する。

```text
features/search-user
        ↓
features/update-user
```

のような依存は行わない。

Entityも同様に、

```text
entities/order
        ↓
entities/user
```

のような直接依存は原則として行わない。

Entity間の依存が避けられない場合は、個別に設計を検討する。

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

1ファイルしか存在しないフォルダをコンポーネントごとに作成しない。

コンポーネントに関連するファイルが複数存在する場合のみ、専用フォルダへの分割を検討する。

```text
ui/
├─ UsersPage.tsx
├─ UserTable.tsx
└─ UserSearchForm/
   ├─ UserSearchForm.tsx
   ├─ UserSearchFields.tsx
   └─ UserSearchForm.test.tsx
```

### Pageコンポーネント

Page Sliceのルートコンポーネントには `<Name>Page.tsx` の命名規則を使用する。

```text
users
→ UsersPage.tsx

user-detail
→ UserDetailPage.tsx

settings
→ SettingsPage.tsx
```

`Page` suffixは、Routerから表示されるPage Sliceのルートコンポーネントであることを表す。

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

### Asset

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

- 下位Layerから上位Layerへの依存
- 同一Layerの別Sliceへの直接依存
- Slice内部へのDeep Import
- Sharedへの業務ドメイン依存コードの配置
- Featureの過度な細分化
- 将来利用する可能性だけを理由とした過度な共通化
- 使用しないSegmentの事前作成
- 1ファイルしか存在しない不要なフォルダの大量作成

特に、以下のように細かな操作をすべてFeature化することは避ける。

```text
features/
├─ open-modal/
├─ close-modal/
├─ change-filter/
└─ select-row/
```

また、

```text
shared/ui/UserTable
shared/ui/OrderSearchForm
```

のように業務ドメインを持つコンポーネントをSharedへ配置しない。

---

## 開発の進め方

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

最初から完成形のFSD構造を設計するのではなく、Pageを起点として実装し、責務や再利用性が明確になった段階で適切なLayerへ抽出する。
