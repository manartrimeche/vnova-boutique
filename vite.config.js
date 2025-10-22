/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  
  const env = loadEnv("mock", process.cwd(), "");
  const processEnValues = {
    "process.env": Object.entries(env).reduce((prev, [key, val]) => {
      return {
        ...prev,
        [key]: val,
      };
    }, {}),
  };

  return {
    server: {
      port: 5175,
      hmr: {
        overlay: false,
      
      },
    },
    plugins: [react()],
    define: processEnValues,
    build: {
      chunkSizeWarningLimit: 10000,
    },
  };
});
