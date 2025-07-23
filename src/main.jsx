import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./utils/index.css";
import { UserProvider } from "./context/UserContext";

// 💥 Hide the preloader div before React takes over
const preloader = document.getElementById("preloader");
if (preloader) {
  preloader.style.display = "none";
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
