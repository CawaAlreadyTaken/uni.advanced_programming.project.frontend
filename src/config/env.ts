export const NODE_ID = Number(import.meta.env.VITE_NODE_ID);
export const API_PORT = 2000+NODE_ID;
export const API_BASE_URL = `http://192.168.106.173:${API_PORT}`;
export const FRONTEND_PORT = Number(import.meta.env.VITE_PORT);
