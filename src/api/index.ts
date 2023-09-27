import { appleLogin, facebookLogin, googleLogin, wechatLogin } from "./user";

export const userApiMap = () => {
  return {
    googleLogin,
    FacebookLogin: facebookLogin,
    appleLogin,
    wechatLogin,
  };
};
