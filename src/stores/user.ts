import { removeCookies } from "@/utils/common";
import { defineStore } from "pinia";
import { CacheKey } from "../enums/storageEnum";

interface UserInfo {
  user_id: string;
  user_name: string;
  role: number;
}
interface WalletInfo {
  token: string;
  type: string;
}

interface StateInterface {
  user_info: UserInfo;
  token: string;
  sceneInstanceResponse: any;
  wallet: WalletInfo;
}

export const useUser = defineStore("user", {
  state: (): StateInterface => ({
    user_info: undefined,
    token: undefined,
    sceneInstanceResponse: undefined,
    wallet: undefined,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return (
        this.user_info || JSON.parse(localStorage.getItem(CacheKey.USER_INFO))
      );
    },
    getToken(): string {
      return this.token || localStorage.getItem(CacheKey.TOKEN);
    },
    getSceneInstanceResponse(): string {
      return (
        this.sceneInstanceResponse ||
        JSON.parse(localStorage.getItem(CacheKey.SCENE_INSTANCE))
      );
    },
    getWallet(): WalletInfo {
      return this.wallet || JSON.parse(localStorage.getItem(CacheKey.WALLET));
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem(CacheKey.TOKEN, token);
    },
    setSceneInstanceResponse(data: any) {
      this.sceneInstanceResponse = data;
      localStorage.setItem(
        CacheKey.SCENE_INSTANCE,
        JSON.stringify(this.sceneInstanceResponse)
      );
    },
    setUserInfo(data: any) {
      this.user_info = {
        ...this.user_info,
        ...data,
      };
      localStorage.setItem(CacheKey.USER_INFO, JSON.stringify(this.user_info));
    },
    setWallet(data: WalletInfo) {
      this.wallet = {
        ...this.wallet,
        ...data,
      };
      localStorage.setItem(CacheKey.WALLET, JSON.stringify(this.wallet));
    },
    logOut() {
      this.token = undefined;
      this.user_info = undefined;
      this.wallet = undefined;
      this.SceneInstanceResponse = undefined;
      localStorage.clear();
      removeCookies();
    },
    disConnectWallet() {
      this.wallet = undefined;
      localStorage.removeItem(CacheKey.WALLET);
    },
  },
});
