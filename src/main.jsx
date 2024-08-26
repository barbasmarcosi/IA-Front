import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import esES from "antd/es/locale/es_ES";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider locale={esES}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ConfigProvider>
);
