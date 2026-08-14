import { Navigate, Route, Routes } from "react-router-dom";
import { AboutPage } from "@pages/about-page";
import { HomePage } from "@pages/home-page";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
