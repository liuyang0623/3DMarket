import router from "@/router";
import axios from "axios";
import { removeCookies, getQueryString } from "../common";

const service = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 30000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    config["headers"] = {
      ...config["headers"],
      Authorization: `Bearer ${localStorage.getItem("FE_LIBRARY_TOKEN")}`,
    };
    return config;
  },
  (err) => {
    return Promise.reject(err); //返回错误
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    if (res.data.errcode === 10022) {
      localStorage.clear();
      removeCookies();
      const instanceId = getQueryString("instanceId");
      console.error(instanceId, "instanceId==========================");
      if (instanceId) {
        router.push({
          path: "/login",
          query: {
            instanceId,
          },
        });
      } else {
        router.push("/login");
      }
    } else {
      return res.data;
    }
  },
  (err) => {
    return Promise.reject(err); //返回错误
  }
);

export default service;
