import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Container, createTheme, Link, Stack, ThemeProvider, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { contactFormDefaultValues, contactFormFieldNames, contactFormSchema, type ContactFormValues } from "@pages/form-validation-page/model/contact-form-schema";
import { ControlledTextField } from "@shared/ui";

const formValidationTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000",
      paper: "#000",
    },
  },
});

export const FormValidationPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<ContactFormValues>({
    // ZodスキーマをResolverとして渡し、フォームの値とエラーをReact Hook Formで一元管理する。
    resolver: zodResolver(contactFormSchema),
    defaultValues: contactFormDefaultValues,
    mode: "onChange",
  });

  const handleValidSubmit = () => {
    // handleSubmitにより、すべての検証ルールを通過した場合のみ実行される。
    setIsSubmitted(true);
    reset();
  };

  const handleInvalidSubmit = () => {
    setIsSubmitted(false);
  };

  return (
    <ThemeProvider theme={formValidationTheme}>
      <Box component="main" sx={{ minHeight: "100svh", bgcolor: "background.default", color: "text.primary", py: 4 }}>
        <Container maxWidth="sm">
          <Stack spacing={3}>
            <Typography component="h1" variant="h2">
              Form Validation
            </Typography>
            <Typography>Submit the form to see validation with React Hook Form and Zod.</Typography>
            <Stack component="form" spacing={2} noValidate onSubmit={handleSubmit(handleValidSubmit, handleInvalidSubmit)}>
              <ControlledTextField name={contactFormFieldNames.name} control={control} label="Name" />
              <ControlledTextField name={contactFormFieldNames.email} control={control} label="Email" type="email" />
              <ControlledTextField name={contactFormFieldNames.message} control={control} label="Message" multiline rows={5} />
              <Button type="submit" variant="contained" size="large" disabled={!isValid || isSubmitting}>
                Submit
              </Button>
            </Stack>
            {isSubmitted && <Alert severity="success">The form is valid.</Alert>}
            <Link component={RouterLink} to="/">
              Back to Home
            </Link>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
