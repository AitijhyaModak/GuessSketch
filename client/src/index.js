import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import HowToPlay from "./components/HowToPlay";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { socket, SocketContext } from "./context/socket";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
  },
  {
    path: "about",
    element: <HowToPlay></HowToPlay>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SocketContext.Provider value={socket}>
    <RouterProvider router={router}></RouterProvider>
  </SocketContext.Provider>
);
