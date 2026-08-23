import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@app/index";

const enableDevelopmentApiMock = async () => {
  if (import.meta.env.DEV) {
    const { enableApiMock } = await import("@app/mocks/enable-api-mock");
    enableApiMock();
  }
};

const bootstrap = async () => {
  await enableDevelopmentApiMock();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

void bootstrap();
