import { createContext, useContext } from "react";

type ErrorNotificationContextValue = {
  notifyError: (error: unknown) => void;
};

export const ErrorNotificationContext = createContext<ErrorNotificationContextValue | null>(null);

// 非同期処理やイベントハンドラで発生したエラーを共通通知へ渡す。
export const useErrorNotification = (): ErrorNotificationContextValue => {
  const context = useContext(ErrorNotificationContext);

  if (!context) {
    throw new Error("useErrorNotification must be used within ErrorNotificationProvider.");
  }

  return context;
};
