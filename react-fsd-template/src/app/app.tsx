import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@app/routes";
import "@app/styles/index.css";

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
