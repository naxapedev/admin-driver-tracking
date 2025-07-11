// src/socket.js
import { io } from 'socket.io-client';

export const socket = io('http://192.168.1.31:4000'); // use your backend IP
