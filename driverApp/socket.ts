// socket.ts
import { io } from 'socket.io-client';

export const socket = io('http://192.168.1.21:4000'); // replace with your backend IP
