import { defineConfig } from "oxlint";

// Slice内部へのDeep Importを禁止する。
// Slice外部から利用するときは、各Slice直下のindex.ts（Public API）を経由する。
const publicApiRestriction = {
  regex: "^@/(pages|widgets|features|entities)/[^/]+/.+",
  message: "Slice内部へのDeep Importは禁止です。Slice外部からはPublic API（index.ts）、同一Slice内では相対importを使用してください。",
};

// このプロジェクトでは React + TypeScript の品質チェックを Oxlint に統一する。
export default defineConfig({
  // React / TypeScript / OXC / Unicorn / Import の各ルール群を有効化する。
  plugins: ["react", "typescript", "oxc", "unicorn", "import"],

  // ビルド出力や依存フォルダは解析対象外にする。
  ignorePatterns: ["dist", "node_modules", "vite-env.d.ts"],

  rules: {
    // ------------------------------------------------------------
    // React
    // ------------------------------------------------------------

    // Hooks の使い方は React のガイドラインに合わせて error とする。
    "react/rules-of-hooks": "error",

    // コンポーネントのエクスポート方針を明示し、定数だけは許容する。
    "react/only-export-components": [
      "warn",
      {
        allowConstantExport: true,
      },
    ],

    // ------------------------------------------------------------
    // General
    // ------------------------------------------------------------

    // 使用していない import や変数は warn で見えるようにする。
    "no-unused-vars": "warn",

    // 不要な console 出力は警告対象にする。
    "no-console": "warn",

    // ------------------------------------------------------------
    // TypeScript
    // ------------------------------------------------------------

    // 型の甘さや any の扱いを warn で見えるようにする。
    "typescript/no-explicit-any": "warn",
    "typescript/no-unsafe-assignment": "warn",
    "typescript/no-unsafe-call": "warn",
    "typescript/no-unsafe-return": "warn",

    // ------------------------------------------------------------
    // Dependency
    // ------------------------------------------------------------

    // 循環依存を禁止する。
    "import/no-cycle": [
      "error",
      {
        // npmなどの外部モジュールは循環依存チェックの対象外とする。
        ignoreExternal: true,

        // 型だけのimportは実行時依存を作らないため対象外とする。
        ignoreTypes: true,
      },
    ],
  },

  // ============================================================
  // FSD Architecture Rules
  // ============================================================
  //
  // app
  //  ↓
  // pages
  //  ↓
  // widgets
  //  ↓
  // features
  //  ↓
  // entities
  //  ↓
  // shared
  //
  // 以下をLinterで強制する。
  //
  // - 下位Layer → 上位Layerへの依存禁止
  // - 同一Layerの別Sliceへの依存禁止
  // - Slice内部へのDeep Import禁止
  // - Slice外部からはPublic APIを利用
  // - 循環依存禁止
  //
  // 同一Slice内部のimportには相対パスを使用する。
  // Slice / Layerを跨ぐimportには @/ aliasを使用する。
  // ============================================================

  overrides: [
    // ------------------------------------------------------------
    // app
    // ------------------------------------------------------------
    {
      files: ["src/app/**/*.{ts,tsx}"],

      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              // appは最上位Layerなので全Layerへ依存可能。
              // ただしSlice内部へのDeep Importは禁止する。
              publicApiRestriction,
            ],
          },
        ],
      },
    },

    // ------------------------------------------------------------
    // pages
    // ------------------------------------------------------------
    {
      files: ["src/pages/**/*.{ts,tsx}"],

      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              // Slice内部へのDeep Importを禁止する。
              publicApiRestriction,

              {
                // pages → app は上位Layerへの依存となるため禁止する。
                regex: "^@/app(/|$)",
                message: "pages Layerからapp Layerへの依存は禁止です。",
              },

              {
                // 同じpages Layerの別Sliceへの依存を禁止する。
                // 同一Slice内部では相対importを使用する。
                regex: "^@/pages/",
                message: "pages Layer内の別Sliceへの依存は禁止です。同一Slice内では相対importを使用してください。",
              },
            ],
          },
        ],
      },
    },

    // ------------------------------------------------------------
    // widgets
    // ------------------------------------------------------------
    {
      files: ["src/widgets/**/*.{ts,tsx}"],

      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              // Slice内部へのDeep Importを禁止する。
              publicApiRestriction,

              {
                // widgetsより上位のLayerへの依存を禁止する。
                regex: "^@/(app|pages)(/|$)",
                message: "widgets Layerから上位Layer（app / pages）への依存は禁止です。",
              },

              {
                // 同じwidgets Layerの別Sliceへの依存を禁止する。
                regex: "^@/widgets/",
                message: "widgets Layer内の別Sliceへの依存は禁止です。同一Slice内では相対importを使用してください。",
              },
            ],
          },
        ],
      },
    },

    // ------------------------------------------------------------
    // features
    // ------------------------------------------------------------
    {
      files: ["src/features/**/*.{ts,tsx}"],

      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              // Slice内部へのDeep Importを禁止する。
              publicApiRestriction,

              {
                // featuresより上位のLayerへの依存を禁止する。
                regex: "^@/(app|pages|widgets)(/|$)",
                message: "features Layerから上位Layer（app / pages / widgets）への依存は禁止です。",
              },

              {
                // Feature Slice同士の依存を禁止する。
                regex: "^@/features/",
                message: "features Layer内の別Sliceへの依存は禁止です。同一Slice内では相対importを使用してください。",
              },
            ],
          },
        ],
      },
    },

    // ------------------------------------------------------------
    // entities
    // ------------------------------------------------------------
    {
      files: ["src/entities/**/*.{ts,tsx}"],

      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              // Slice内部へのDeep Importを禁止する。
              publicApiRestriction,

              {
                // entitiesより上位のLayerへの依存を禁止する。
                regex: "^@/(app|pages|widgets|features)(/|$)",
                message: "entities Layerから上位Layer（app / pages / widgets / features）への依存は禁止です。",
              },

              {
                // Entity Slice同士の直接依存を禁止する。
                regex: "^@/entities/",
                message: "entities Layer内の別Sliceへの依存は禁止です。同一Slice内では相対importを使用してください。",
              },
            ],
          },
        ],
      },
    },

    // ------------------------------------------------------------
    // shared
    // ------------------------------------------------------------
    {
      files: ["src/shared/**/*.{ts,tsx}"],

      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                // sharedは最下位Layerなので、
                // 他のFSD Layerへの依存をすべて禁止する。
                regex: "^@/(app|pages|widgets|features|entities)(/|$)",
                message: "shared Layerから他のFSD Layerへの依存は禁止です。",
              },
            ],
          },
        ],
      },
    },

    // ------------------------------------------------------------
    // main.tsx
    // ------------------------------------------------------------
    {
      files: ["src/main.tsx"],

      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                // main.tsxからapp内部へのDeep Importを禁止する。
                //
                // OK:
                // import { App } from "@/app";
                //
                // NG:
                // import { AppRouter } from "@/app/routes";
                regex: "^@/app/.+",
                message: "main.tsxからapp内部へのDeep Importは禁止です。@/app のPublic APIを使用してください。",
              },

              {
                // main.tsxではFSD内部の各Layerを直接組み立てない。
                // アプリケーション構成はapp Layerへ委譲する。
                regex: "^@/(pages|widgets|features|entities|shared)(/|$)",
                message: "main.tsxからFSD Layerを直接参照せず、@/app を経由してください。",
              },
            ],
          },
        ],
      },
    },
  ],
});
