import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/home/index.vue";
import { sceneConfig } from "@/config/sceneConfig";
import { getQueryString } from "@/utils/common";

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASEURL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/character",
      name: "character",
      // meta: { white: true },
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login/index.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (!localStorage.getItem("FE_LIBRARY_TOKEN")) {
    if (to?.meta?.white) {
      next();
    } else if (to.name !== "login") {
      if (to.name === "character") {
        router.push("/login?redirect=character");
      } else {
        router.push({ path: "/login", query: to.query });
      }
    } else if (to.name === "login") {
      const host = window.location.hostname;
      const redirectName = sceneConfig[host]?.name;
      if (redirectName) {
        window.location.href =
          "https://login.wdabuliu.com/login?redirect=" + redirectName;
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
