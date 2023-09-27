import { googleTokenLogin } from "vue3-google-login";
import { randomString, getQueryString } from "./common";
import request from "@/utils/http/request";
import $loading from "@/plugins/loading/package";
import $message from "@/plugins/message/package";
export const googleLogin = async (userApi: any, loginSuccessCb: Function) => {
  const { VITE_GOOGLE_CLIENT_ID } = import.meta.env;
  googleTokenLogin({
    clientId: VITE_GOOGLE_CLIENT_ID,
  }).then((response) => {
    getGooleUserInfo(response.access_token, userApi, loginSuccessCb);
  });
};

const getGooleUserInfo = async (
  token: string,
  userApi: any,
  loginSuccessCb: Function
) => {
  $loading.showLoading("登录中");
  try {
    const data = await request.get(
      "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + token
    );
    const { email, family_name, given_name, name, picture, sub } = data;
    const res = await userApi.googleLogin({
      google_user_id: sub,
      email,
      name,
      picture_url: picture,
      family_name,
      given_name,
    });
    $loading.hideLoading();
    if (res.errcode === 0) {
      const { token, user_info } = res.data.login_response;
      const scene_instance_response = res.data.scene_instance_response;
      loginSuccessCb(token, user_info, scene_instance_response);
    } else {
      $message.error(res.msg);
    }
  } catch (err) {
    console.log(err);
    $message.error("登录错误");
  }
  $loading.hideLoading();
};

export const facebookLogin = async (userApi: any, loginSuccessCb: Function) => {
  try {
    window.FB.login(
      (res) => {
        if (res.status === "connected" && res.authResponse) {
          const { accessToken } = res.authResponse;
          $loading.showLoading("登录中");
          window.FB.api("/me", (userInfoRes) => {
            const { name } = userInfoRes;
            window.FB.getLoginStatus(async (loginRes) => {
              const { userID, email } = loginRes.authResponse;
              const res = await userApi.FacebookLogin({
                fb_user_id: userID,
                fb_email: email,
                fb_name: name,
                fb_header_url: `http://graph.facebook.com/${userID}/picture?type=large`,
              });
              if (res.errcode === 0) {
                const { token, user_info } = res.data.login_response;
                const scene_instance_response =
                  res.data.scene_instance_response;
                loginSuccessCb(token, user_info, scene_instance_response);
              } else {
                $message.error(res.msg);
              }
            });
          });
        } else {
          $loading.hideLoading();
        }
      },
      { scope: "public_profile,email,user_friends" }
    );
  } catch (error) {
    console.log(error);
  } finally {
    $loading.hideLoading();
  }
};

export const appleLogin = async (userApi: any, loginSuccessCb: Function) => {
  const { VITE_APPLE_ID, VITE_APPLE_REDIRECTURI } = import.meta.env;
  const redirectUri =
    window.location.hostname.indexOf("space3d") !== -1
      ? "https://space3d.wdabuliu.com/login"
      : VITE_APPLE_REDIRECTURI;
  window.AppleID.auth.init({
    clientId: VITE_APPLE_ID,
    scope: "name email",
    redirectURI: redirectUri,
    state: randomString(3),
    usePopup: true,
  });
  try {
    $loading.showLoading("登录中...");
    const data = await window.AppleID.auth.signIn();
    if (data) {
      const res = await userApi.appleLogin({
        token: data.authorization.id_token,
      });
      if (res.errcode === 0) {
        const { token, user_info } = res.data.login_response;
        const scene_instance_response = res.data.scene_instance_response;
        loginSuccessCb(token, user_info, scene_instance_response);
      } else {
        $message.error(res.msg);
      }
    } else {
      $message.error("登录错误");
    }
    $loading.hideLoading();
  } catch (error) {
    $message.warning(error.error);
    $loading.hideLoading();
  }
};

export const wechatLogin = async (
  userApi: any,
  loginSuccessCb: Function,
  type: string
) => {
  const { VITE_WECHAT_APP_ID, VITE_WECHAT_REDIRECTURI } = import.meta.env;
  const redirect = getQueryString("redirect");
  if (type === "click") {
    new WxLogin({
      self_redirect: true,
      id: "wx-login-id",
      appid: VITE_WECHAT_APP_ID,
      scope: "snsapi_login",
      redirect_uri: encodeURIComponent(
        VITE_WECHAT_REDIRECTURI + "?redirect=" + (redirect || "")
      ),
      state: randomString(3),
      style: "black",
      href: "https://static.wdabuliu.com/13d8a570-38db-4d11-a6ff-abb6b84c76e01674985724603.css",
    });
    const wxIframe = document.getElementById("wx-login-id");
    const ifrm: any = wxIframe?.childNodes[0];
    ifrm.setAttribute("allow", "microphone *;camera *");
    ifrm.src = ifrm.src;
  } else {
    try {
      if (getQueryString("code")) {
        $loading.showLoading("登录中...");
        const res = await userApi.wechatLogin({
          code: getQueryString("code"),
          type: "space3D",
        });
        $loading.hideLoading();
        if (res.errcode === 0) {
          const { token, user_info } = res.data.login_response;
          const scene_instance_response = res.data.scene_instance_response;
          loginSuccessCb(token, user_info, scene_instance_response);
        }
      }
    } catch (error) {
      $message.warning(JSON.stringify(error));
      $loading.hideLoading();
    }
  }
};

const langs = {
  cn: {
    LOADING: "加载中...", //加载
    SLIDER_LABEL: "请向右滑动验证", //等待滑动
    CHECK_Y: "验证通过", //通过
    ERROR_TITLE: "非常抱歉，这出错了...", //拦截
    CHECK_N: "验证未通过", //准备唤醒二次验证
    OVERLAY_INFORM: "经检测你当前操作环境存在风险，请输入验证码", //二次验证
    TIPS_TITLE: "验证码错误，请重新输入", //验证码输错时的提示
  },
  en: {
    LOADING: "Loading...", //加载
    SLIDER_LABEL: "Please swipe right to verify", //等待滑动
    CHECK_Y: "Verification passed", //通过
    ERROR_TITLE: "Sorry, this went wrong...", //拦截
    CHECK_N: "Verification failed", //准备唤醒二次验证
    OVERLAY_INFORM:
      "It has been detected that your current operating environment is risky, please enter the verification code", //二次验证
    TIPS_TITLE: "Verification code error, please re-enter", //验证码输错时的提示
  },
};

export const captchaInit = (id: string, lang: string = "cn", cb: Function) => {
  const { VITE_CAPTCHA_API_KEY, VITE_CAPTCHA_SCENE } = import.meta.env;
  const nc_token = [
    VITE_CAPTCHA_API_KEY,
    new Date().getTime(),
    Math.random(),
  ].join(":");
  const nc = NoCaptcha.init({
    renderTo: id,
    appkey: VITE_CAPTCHA_API_KEY,
    scene: VITE_CAPTCHA_SCENE,
    token: nc_token,
    trans: { key1: "code200" },
    elementID: ["usernameID"],
    is_Opt: 0,
    upLang: langs,
    language: lang === "en" ? "en" : "cn",
    timeout: 10000,
    retryTimes: 5,
    errorTimes: 5,
    inline: false,
    apimap: {
      // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
      // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
    },
    bannerHidden: false,
    initHidden: false,
    callback: function (data) {
      const { csessionid, sig, value } = data;
      cb({
        sig,
        session_id: csessionid,
        token: nc_token,
      });
    },
    error: function (s) {},
  });
  NoCaptcha.setEnabled(true);
  nc.reset(); //请务必确保这里调用一次reset()方法
};
