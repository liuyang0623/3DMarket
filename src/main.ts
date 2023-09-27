import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import { isMobile } from "./utils/common";
window.VITE_STATIC_GODOT_CDN = import.meta.env.VITE_STATIC_GODOT_CDN;
window.VITE_SPACE_MODE = import.meta.env.MODE;
window.isMobileGodot = isMobile;
window.VITE_API_HOST = import.meta.env.VITE_API_HOST;
window.APP_BASE_URL = import.meta.env.VITE_APP_BASEURL;
import VConsole from "vconsole";
import { useUser } from "./stores/user";
import { getHomePage } from "./api/user";
import Cookies from "js-cookie";
import { sceneConfig } from "./config/sceneConfig";
if (import.meta.env.MODE !== "production" && isMobile.any()) {
  new VConsole();
}
async function userInfoInit() {
  const localToken = localStorage.getItem("FE_LIBRARY_TOKEN");
  const sceneData = sceneConfig[window.location.hostname];
  if (sceneData) {
    window.document.title = sceneData.name + " metaverse";
    const user_info = Cookies.get("user_info");
    const scene_instance_response = Cookies.get("scene_instance_response");
    const token = Cookies.get("token");
    if (localToken && localToken !== token) {
      localStorage.clear();
    }
    userStore.setUserInfo(user_info && JSON.parse(user_info));
    userStore.setToken(token || "");
    userStore.setSceneInstanceResponse(
      scene_instance_response && JSON.parse(scene_instance_response)
    );
  }
  if (localStorage.getItem("FE_LIBRARY_TOKEN")) {
    getHomePage();
  }
}
const app = createApp(App);
app.use(createPinia());
const userStore = useUser();
userInfoInit();
app.use(router);

app.mount("#app");
