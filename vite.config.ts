import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import fs from "fs";

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  const { VITE_APP_BASEURL } = wrapperEnv(mode);
  if(mode !== 'development'){
    setVersion();
  }
  
  return defineConfig({
    base: VITE_APP_BASEURL,
    plugins: [vue(), vueJsx()],
    server: {
      host: "0.0.0.0",
      port: 3000,
      // https: {
      //   cert: fs.readFileSync("ssl/teata.wdabuliu.com+3.pem"),
      //   key: fs.readFileSync("ssl/teata.wdabuliu.com+3-key.pem"),
      // },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "#": fileURLToPath(new URL("./types", import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/css/variable.scss";',
        },
      },
    },
  });
};

function wrapperEnv(mode: any) {
  return loadEnv(mode, process.cwd());
}

function setVersion(mode: any) {
  let data = fs.readFileSync('./public/version.json') //fs读取文件
  let versionData = JSON.parse(data);
  versionData.version = new Date().getTime();
  fs.writeFile(
    './public/version.json',
    JSON.stringify(versionData, null, '\t'),
    (err) => {
      if (err) {
        console.log('写入失败', err)
      } else {
        console.log('版本号写入成功')
      }
    }
  )
}
