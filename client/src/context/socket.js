import { io } from "socket.io-client";
import { createContext } from "react";

console.log(process.env.REACT_APP_SOCKET_URL);
export const socket = io("http://192.168.29.176:5000");
export const SocketContext = createContext();
