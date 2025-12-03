import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartProvider.jsx";
import { WalletProvider } from "./context/WalletProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </WalletProvider>
    </BrowserRouter>
  </StrictMode>
);
