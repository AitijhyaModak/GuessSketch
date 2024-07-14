import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { socket, SocketContext } from "./context/socket";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SocketContext.Provider value={socket}>
    <App />
  </SocketContext.Provider>
);
