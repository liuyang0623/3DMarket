import request from "@/utils/http/request";
enum Api {
  GetSmsCode = "/note/ssoserver/getsms",
  LoginByPhone = "/note/ssoserver/phone/login/by/code",
  GoogleLogin = "/note/ssoserver/googlelogin",
  FacebookLogin = "/note/ssoserver/facebook/login",
  AppleLogin = "/note/ssoserver/applelogin/customize",
  WechatLogin = "/note/ssoserver/wechatlogin/customize",
  BindWallet = "/note/wallet/user/bind",
  UnBindWallet = "/note/wallet/user/unbind/by/wallet_address",
  SubmitNftData = "/note/wallet/add/user/nft",
  GetHomePage = "/note/game/user/get/home_page",
  LoginByEmail = "/note/ssoserver/email/login/by/code",
  GetEmailSmsCode = "/note/ssoserver/sliding/verification/email",
  GetVerSmsCode = "/note/ssoserver/sliding/verification/sms",
}

const clientInfo = JSON.stringify({
  channel: "",
  platform: "PC",
  device_model: "",
  app_version: "",
  app_version_name: "",
  os_version: "",
});
/**
 * 获取用户个人主页
 */
export const getHomePage = () => {
  return request.get(Api.GetHomePage);
};
/**
 * 获取验证码
 */
export const getSmsCodeService = (params: { phone: string }) => {
  return request.get(Api.GetSmsCode, { params });
};
/**
 * 获取邮箱验证码
 */
export const getVerEmailSmsCode = (params: {
  email: string;
  verification_request: any;
}) => {
  return request.post(Api.GetEmailSmsCode, params, {
    headers: {
      "client-info": clientInfo,
    },
  });
};
/**
 * 获取短信验证码（人机验证）
 */
export const getVerSmsCode = (params: {
  phone: string;
  verification_request: any;
}) => {
  return request.post(Api.GetVerSmsCode, params, {
    headers: {
      "client-info": clientInfo,
    },
  });
};

/**
 * 手机号验证码登录
 */
export const loginByPhone = (params: { phone: string; code: string }) => {
  return request.post(Api.LoginByPhone, params, {
    headers: {
      "client-info": clientInfo,
    },
  });
};
/**
 * 邮箱验证码登录
 */
export const loginByEmail = (params: { email: string; code: string }) => {
  return request.post(Api.LoginByEmail, params, {
    headers: {
      "client-info": clientInfo,
    },
  });
};

/**
 * 谷歌登录，直接提交前端获取到的明文用户信息
 */
export const googleLogin = (params: any) => {
  return request.post(Api.GoogleLogin, params, {
    headers: {
      "client-info": clientInfo,
    },
  });
};
/**
 * facebook登录，直接提交前端获取到的明文用户信息
 */
export const facebookLogin = (params: any) => {
  return request.post(Api.FacebookLogin, params, {
    headers: {
      "client-info": clientInfo,
    },
  });
};
/**
 * 苹果登录
 */
export const appleLogin = (params: any) => {
  return request.get(Api.AppleLogin, {
    params,
    headers: {
      "client-info": clientInfo,
    },
  });
};
/**
 * 微信扫码登录
 */
export const wechatLogin = (params) => {
  return request.get(Api.WechatLogin, {
    params,
    headers: {
      "client-info": clientInfo,
    },
  });
};
