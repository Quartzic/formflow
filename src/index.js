import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import NiceModal from "@ebay/nice-modal-react";

TimeAgo.addDefaultLocale(en);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NiceModal.Provider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NiceModal.Provider>
  </React.StrictMode>
);
