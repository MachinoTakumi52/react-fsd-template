import { z } from "zod";

// 検証ルールとTypeScriptの型で同じ定義を参照できるよう、スキーマを信頼できる唯一の情報源とする。
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.email("Enter a valid email address."),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
});

// フィールド名はスキーマから生成し、文字列リテラルの重複を防ぐ。
export const contactFormFieldNames = contactFormSchema.keyof().enum;

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// 初期化値
export const contactFormDefaultValues = {
  name: "",
  email: "",
  message: "",
} satisfies ContactFormValues;
