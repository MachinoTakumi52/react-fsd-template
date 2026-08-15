import { TextField, type TextFieldProps } from "@mui/material";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

type ControlledTextFieldProps<TFieldValues extends FieldValues> = Omit<TextFieldProps, "error" | "helperText" | "name"> & {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
};

// MUI TextFieldとReact Hook Formの値・エラー接続を共通化する。
export const ControlledTextField = <TFieldValues extends FieldValues>({ name, control, ...textFieldProps }: ControlledTextFieldProps<TFieldValues>) => (
  <Controller name={name} control={control} render={({ field, fieldState }) => <TextField {...textFieldProps} {...field} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />} />
);
