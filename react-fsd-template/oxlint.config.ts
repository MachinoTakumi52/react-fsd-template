import { defineConfig } from "oxlint";

// このプロジェクトでは React + TypeScript の品質チェックを Oxlint に統一する。
export default defineConfig({
  // React / TypeScript / OXC / Unicorn の各ルール群を有効化する。
  plugins: ["react", "typescript", "oxc", "unicorn"],

  // ビルド出力や依存フォルダは解析対象外にする。
  ignorePatterns: ["dist", "node_modules", "vite-env.d.ts"],

  rules: {
    // Hooks の使い方は React のガイドラインに合わせて error とする。
    "react/rules-of-hooks": "error",

    // コンポーネントのエクスポート方針を明示し、定数だけは許容する。
    "react/only-export-components": ["warn", { allowConstantExport: true }],

    // 使用していない import や変数は warn で見えるようにする。
    "no-unused-vars": "warn",

    // 不要な console 出力は警告対象にする。
    "no-console": "warn",

    // 型の甘さや any の扱いを warn で見えるようにする。
    "typescript/no-explicit-any": "warn",
    "typescript/no-unsafe-assignment": "warn",
    "typescript/no-unsafe-call": "warn",
    "typescript/no-unsafe-return": "warn",
  },
});
