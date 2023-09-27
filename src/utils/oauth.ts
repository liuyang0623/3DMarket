import { message } from "antd";
import { randomString, getQueryString } from "./common";
import {
  facebookLogin,
  googleLogin,
  appleLogin,
  wechatLogin,
} from "../api/user";
import axios from "axios";

export const initApi = (type: string) => {
  const scriptEl = document.createElement("script");
  scriptEl.type = "text/javascript";
  scriptEl.async = true;
  scriptEl.defer = true;
  switch (type) {
    case "google":
      scriptEl.src = "//accounts.google.com/gsi/client";
      break;
    case "facebook":
      scriptEl.src = `//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v15.0&appId=${process.env.REACT_APP_FACEBOOK_APP_ID}&autoLogAppEvents=1`;
      break;
    default:
      break;
  }
  document.body.append(scriptEl);
};

export const getGooleUserInfo = async (
  token: string,
  loginSuccessCb: Function
) => {
  const { data } = await axios.get(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
  );
  const { email, family_name, given_name, name, picture, sub } = data;
  const res = await googleLogin({
    google_user_id: sub,
    email,
    name,
    picture_url: picture,
    family_name,
    given_name,
  });
  if (res.errcode === 0) {
    message.success("登录成功");
    const { token, user_info } = res.data.login_response;
    loginSuccessCb(token, user_info);
  } else {
    message.error(res.msg);
  }
};
export const loginByFaceBook = async (loginSuccessCb: Function) => {
  try {
    window.FB.login(
      (res: any) => {
        if (res.status === "connected" && res.authResponse) {
          window.FB.api("/me", (userInfoRes: any) => {
            const { name } = userInfoRes;
            window.FB.getLoginStatus(async (loginRes: any) => {
              const { userID, email } = loginRes.authResponse;
              const res = await facebookLogin({
                fb_user_id: userID,
                fb_email: email,
                fb_name: name,
                fb_header_url: `http://graph.facebook.com/${userID}/picture?type=large`,
              });
              if (res.errcode === 0) {
                const { token, user_info } = res.data.login_response;
                loginSuccessCb(token, user_info);
              } else {
                message.error(res.msg);
              }
            });
          });
        } else {
        }
      },
      { scope: "public_profile,email,user_friends" }
    );
  } catch (error) {
    console.log(error);
  } finally {
  }
};

export const loginByApple = async (loginSuccessCb: Function) => {
  const { REACT_APP_APPLE_ID, REACT_APP_REDIRECTURI } = process.env;
  window.AppleID.auth.init({
    clientId: REACT_APP_APPLE_ID,
    scope: "name email",
    redirectURI: REACT_APP_REDIRECTURI,
    state: randomString(3),
    usePopup: true,
  });
  try {
    const data = await window.AppleID.auth.signIn();
    if (data) {
      const res = await appleLogin({
        token: data.authorization.id_token,
      });
      if (res.errcode === 0) {
        const { token, user_info } = res.data.login_response;
        loginSuccessCb(token, user_info);
      } else {
        message.error(res.msg);
      }
    } else {
      message.error("登录错误");
    }
  } catch (error: any) {
    message.warning(error.error);
  }
};

export const loginByWechat = async (loginSuccessCb: Function, type: string) => {
  console.log(getQueryString("code"), 'getQueryString("code")')
  const { REACT_APP_WECHAT_APP_ID, REACT_APP_REDIRECTURI } = process.env;
  if (type === "click") {
    window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${REACT_APP_WECHAT_APP_ID}&redirect_uri=${encodeURIComponent(
      REACT_APP_REDIRECTURI || ''
    )}&response_type=code&scope=snsapi_login&state=${randomString(
      3
    )}&style=black#wechat_redirect`;
  } else {
    if (getQueryString("code")) {
      const res = await wechatLogin({
        code: getQueryString("code") || '',
        type: "WEB",
      });
      if (res.errcode === 0) {
        const { token, user_info } = res.data;
        loginSuccessCb(token, user_info);
      } else {
        message.error(res.msg);
      }
    } else {
      window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${REACT_APP_WECHAT_APP_ID}&redirect_uri=${encodeURIComponent(
        REACT_APP_REDIRECTURI || ''
      )}&response_type=code&scope=snsapi_login&state=${randomString(
        3
      )}&style=black#wechat_redirect`;
    }
  }
};
