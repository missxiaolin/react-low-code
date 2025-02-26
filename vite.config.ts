import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePluginExternals } from "vite-plugin-externals-new";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  // build: {
  //   outDir: './dist',
  // },
  // server: {
  //   host: '127.0.0.1',
  //   port: 8080,
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //   },
  //   proxy: {
  //     '/api': {
  //       // 如果本地启动后端，请替换为后端地址
  //       target: '',
  //       changeOrigin: true,
  //     },
  //   },
  // },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    visualizer({
      open: true, // 打包完成后自动打开浏览器
    }),
    process.env.NODE_ENV === "production" &&
      VitePluginExternals({
        react: {
          src: "/static/lib/react.production.min.js",
          varName: "React",
        },
        "react-dom": {
          src: "/static/lib/react-dom.production.min.js",
          varName: "ReactDOM",
        },
        dayjs: {
          src: "/static/lib/dayjs.min.js",
          varName: "dayjs",
        },
        antd: {
          src: "/static/lib/antd.min.js",
          varName: "antd",
        },
        "@ant-design/icons": {
          src: "/static/lib/ant-design-icons.min.js",
          varName: "icons",
        },
        ahooks: {
          src: "/static/lib/ahooks.min.js",
          varName: "ahooks",
        },
        axios: {
          src: "/static/lib/axios.min.js",
          varName: "axios",
        },
        "@ant-design/plots": {
          src: "/static/lib/plots.min.js",
          varName: "Plots",
        },
      }),
    svgr({ svgrOptions: { icon: true } }),
  ],
});
