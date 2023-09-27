// export const captchaInit = (id: string, lang: string = "cn", cb: Function) => {
//   const { REACT_APP_CAPTCHA_API_KEY, REACT_APP_CAPTCHA_SCENE } = process.env;
//   const langs = {
//     cn: {
//       LOADING: "加载中...", //加载
//       SLIDER_LABEL: "请向右滑动验证", //等待滑动
//       CHECK_Y: "验证通过", //通过
//       ERROR_TITLE: "非常抱歉，这出错了...", //拦截
//       CHECK_N: "验证未通过", //准备唤醒二次验证
//       OVERLAY_INFORM: "经检测你当前操作环境存在风险，请输入验证码", //二次验证
//       TIPS_TITLE: "验证码错误，请重新输入", //验证码输错时的提示
//     },
//     en: {
//       LOADING: "Loading...", //加载
//       SLIDER_LABEL: "Please swipe right to verify", //等待滑动
//       CHECK_Y: "Verification passed", //通过
//       ERROR_TITLE: "Sorry, this went wrong...", //拦截
//       CHECK_N: "Verification failed", //准备唤醒二次验证
//       OVERLAY_INFORM:
//         "It has been detected that your current operating environment is risky, please enter the verification code", //二次验证
//       TIPS_TITLE: "Verification code error, please re-enter", //验证码输错时的提示
//     },
//   };
//   const nc_token = [
//     REACT_APP_CAPTCHA_API_KEY,
//     new Date().getTime(),
//     Math.random(),
//   ].join(":");
//   const nc = window.NoCaptcha.init({
//     renderTo: id,
//     appkey: REACT_APP_CAPTCHA_API_KEY,
//     scene: REACT_APP_CAPTCHA_SCENE,
//     token: nc_token,
//     trans: { key1: "code200" },
//     elementID: ["usernameID"],
//     is_Opt: 0,
//     upLang: langs,
//     language: lang === "en" ? "en" : "cn",
//     timeout: 10000,
//     retryTimes: 5,
//     errorTimes: 5,
//     inline: false,
//     apimap: {
//       // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
//       // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
//     },
//     bannerHidden: false,
//     initHidden: false,
//     callback: function (data: any) {
//       const { csessionid, sig } = data;
//       cb({
//         sig,
//         session_id: csessionid,
//         token: nc_token,
//       });
//     },
//   });
//   window.NoCaptcha.setEnabled(true);
//   nc.reset(); //请务必确保这里调用一次reset()方法
// };

export const captchaInit = (id: string, lang: string = "cn", cb: Function) => {
  const { REACT_APP_CAPTCHA_API_KEY, REACT_APP_CAPTCHA_SCENE } = process.env;
  const langs = {
    cn: {
      LOADING: "加载中...", //加载
      SLIDER: "请向右滑动验证", //等待滑动
      SUCCESS: "验证通过", //通过
      ERROR: "非常抱歉，这出错了...", //拦截
      FAIL: "验证未通过", //准备唤醒二次验证
      OVERLAY_INFORM: "经检测你当前操作环境存在风险，请输入验证码", //二次验证
      TIPS_TITLE: "验证码错误，请重新输入", //验证码输错时的提示
    },
    en: {
      LOADING: "Loading...", //加载
      SLIDER: "Please swipe right to verify", //等待滑动
      SUCCESS: "Verification passed", //通过
      ERROR: "Sorry, this went wrong...", //拦截
      FAIL: "Verification failed", //准备唤醒二次验证
      OVERLAY_INFORM:
        "It has been detected that your current operating environment is risky, please enter the verification code", //二次验证
      TIPS_TITLE: "Verification code error, please re-enter", //验证码输错时的提示
    },
  };
  window.AWSC.use("nc", (state: any, module: any) => {
    window.nc = module.init({
      appkey: REACT_APP_CAPTCHA_API_KEY,
      scene: REACT_APP_CAPTCHA_SCENE,
      renderTo: id,
      upLang: langs,
      language: lang === "en" ? "en" : "cn",
      success: function (data: any) {
        const { sessionId, sig, token } = data;
        cb({
          sig,
          session_id: sessionId,
          token,
        });
      },
    });
  });
};
