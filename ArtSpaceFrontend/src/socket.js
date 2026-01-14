// socket.js
import { io } from "socket.io-client";

// 1. Initialize the connection
export const socket = io("http://localhost:3000");

// 2. Helper functions to use in your components
export const joinPostRoom = (postId) => {
  socket.emit("join-post", postId);
};

export const leavePostRoom = (postId) => {
  socket.emit("leave-post", postId);
};