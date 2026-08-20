import { Alert, Snackbar } from "@mui/material";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ErrorNotificationContext, getErrorMessage } from "@shared/lib/error";

type ErrorNotificationProviderProps = {
  children: ReactNode;
};

export const ErrorNotificationProvider = ({ children }: ErrorNotificationProviderProps) => {
  const [message, setMessage] = useState<string | null>(null);

  const notifyError = useCallback((error: unknown) => {
    setMessage(getErrorMessage(error));
  }, []);

  const contextValue = useMemo(() => ({ notifyError }), [notifyError]);

  const handleClose = () => {
    setMessage(null);
  };

  return (
    <ErrorNotificationContext value={contextValue}>
      {children}
      <Snackbar
        open={message !== null}
        autoHideDuration={6_000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
      >
        <Alert severity="error" variant="filled" onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
    </ErrorNotificationContext>
  );
};
