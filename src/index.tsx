import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { initApi } from "./utils/oauth";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactDOM from "react-dom/client";
import "./index.css";
import RenderRoutes from "./routes";
import "./locales/setupI18n";
import { routes } from "./routes/routes";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import "@/assets/icon/iconfont.css";
import "@/assets/css/global.scss";
import "@/assets/font/font.css";
// import { setRemUnit } from "@/utils/dom";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
// setRemUnit();
initApi("facebook");
root.render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename={process.env.REACT_APP_PUBLIC_PATH}>
          <RenderRoutes routes={routes} />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
  // </React.StrictMode>
);
