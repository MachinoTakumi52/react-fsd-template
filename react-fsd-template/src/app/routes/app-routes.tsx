import { Route, Routes } from "react-router-dom";
import { AboutPage } from "@pages/about-page";
import { FormValidationPage } from "@pages/form-validation-page";
import { HomePage } from "@pages/home-page";
import { NotFoundPage } from "@pages/not-found-page";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/form-validation" element={<FormValidationPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
