import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Container, createTheme, Link, Stack, ThemeProvider, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { login } from "@features/login";
import { loginFormDefaultValues, loginFormFieldNames, loginFormSchema, type LoginFormValues } from "@pages/login-page/model/login-form-schema";
import { useErrorNotification } from "@shared/lib/error";
import { ControlledTextField } from "@shared/ui";

const loginTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000",
      paper: "#000",
    },
  },
});

export const LoginPage = () => {
  const [loggedInUserName, setLoggedInUserName] = useState<string>();
  const { notifyError } = useErrorNotification();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefaultValues,
    mode: "onChange",
  });

  const handleLogin = async (values: LoginFormValues) => {
    setLoggedInUserName(undefined);

    try {
      // FeatureのPublic APIを経由してログインAPIを呼び出す。
      const user = await login(values);
      setLoggedInUserName(user.name);
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <ThemeProvider theme={loginTheme}>
      <Box component="main" sx={{ minHeight: "100svh", bgcolor: "background.default", color: "text.primary", py: 4 }}>
        <Container maxWidth="sm">
          <Stack spacing={3}>
            <Typography component="h1" variant="h2">
              Login
            </Typography>
            <Typography>メールアドレスとパスワードを入力してください。</Typography>
            <Stack component="form" spacing={2} noValidate onSubmit={handleSubmit(handleLogin)}>
              <ControlledTextField name={loginFormFieldNames.email} control={control} label="メールアドレス" type="email" autoComplete="email" />
              <ControlledTextField name={loginFormFieldNames.password} control={control} label="パスワード" type="password" autoComplete="current-password" />
              <Button type="submit" variant="contained" size="large" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "ログイン中..." : "ログイン"}
              </Button>
            </Stack>
            {loggedInUserName && <Alert severity="success">{loggedInUserName}さんとしてログインしました。</Alert>}
            <Link component={RouterLink} to="/" color="inherit">
              ホームへ戻る
            </Link>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
