import { z } from "zod";

/** ログインフォームの入力ルール */
export const loginFormSchema = z.object({
  email: z.email("正しいメールアドレスを入力してください。"),
  password: z.string().min(1, "パスワードを入力してください。"),
});

// フィールド名をスキーマから生成し、文字列のベタ書きを防ぐ。
export const loginFormFieldNames = loginFormSchema.keyof().enum;

export type LoginFormValues = z.infer<typeof loginFormSchema>;

/** ログインフォームの初期値 */
export const loginFormDefaultValues = {
  email: "",
  password: "",
} satisfies LoginFormValues;
