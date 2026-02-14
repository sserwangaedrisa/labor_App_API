import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Providers } from "./providers"; // use exactly your version

export const App = () => {
  return (
    <Providers>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Providers>
  );
};
