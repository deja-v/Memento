const envUrl = import.meta.env.VITE_API_URL;

export const BASE_URL = envUrl || "http://localhost:3000";
