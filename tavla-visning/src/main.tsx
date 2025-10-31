import "core-js/stable";
import "regenerator-runtime/runtime";
import "whatwg-fetch";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BoardPage from "./Page";
import "./Shared/styles/fonts.css";
import "./Shared/styles/imports.css";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BoardPage />
  </StrictMode>,
);
