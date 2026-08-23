import AxiosMockAdapter from "axios-mock-adapter";
import { registerLoginMock } from "@features/login/api/login.mock";
import { apiClient } from "@shared/api";

/** 開発用APIモックを登録する */
export const enableApiMock = () => {
  const mock = new AxiosMockAdapter(apiClient, {
    delayResponse: 500,
    onNoMatch: "passthrough",
  });

  registerLoginMock(mock);
};
