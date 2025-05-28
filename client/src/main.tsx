import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
// import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toast";
import { SocketProvider } from "./context/socketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <ToastContainer position="top-right" />
        <App />
      </SocketProvider>
    </Provider>
  </StrictMode>
);
