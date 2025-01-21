import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

// Safely fetch the root element
const rootElement = document.getElementById("root");

if (rootElement) {
  // Only proceed if the root element exists
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  // Handle the case where the root element doesn't exist
  console.error(
    "Root element with id 'root' not found. Ensure your project is configured correctly."
  );
}
