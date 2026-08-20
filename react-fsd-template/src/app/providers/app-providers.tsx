import type { ReactNode } from "react";
import { ErrorNotificationProvider } from "@shared/ui";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return <ErrorNotificationProvider>{children}</ErrorNotificationProvider>;
};
