import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { setToken, setUserInfo } from "@/store/modules/user";
import { useAppDispatch } from "@/store/hooks";
import {
  getEmailSmsCode,
  getPhoneSmsCode,
  loginByEmail,
  loginByPhone,
} from "@/api/user";
import { useGoogleLogin } from "@react-oauth/google";
import {
  loginByApple,
  loginByFaceBook,
  loginByWechat,
  getGooleUserInfo,
} from "@/utils/oauth";
import Captcha from "@/components/common/captcha/Captcha";
import PhonePrefix from "@/components/common/phonePrefix/PhonePrefix";
import "./login.scss";
import { message } from "antd";
export default function Login() {
  const { t } = useTranslation();
  const navigator = useNavigate();
  const dispatch = useAppDispatch();

  const quickLoginMap = [
    {
      icon: "icon-apple",
      name: "apple",
    },
    {
      icon: "icon-wechat",
      name: "wechat",
    },
    {
      icon: "icon-google",
      name: "google",
    },
    {
      icon: "icon-facebook",
      name: "facebook",
    },
  ];
  const [isSpaceULogin, setIsSpaceULogin] = useState(false);
  // 验证码及阿里云滑块验证
  const [loginType, setLoginType] = useState("email");
  const changeLoginType = (type: string) => {
    setLoginType(type);
    setSmsCode("");
    setEmail("");
    setPhone("");
  };
  const [prefix, setPrefix] = useState("+86");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [canGetSms, setCanGetSms] = useState(true);
  const [smsCode, setSmsCode] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const captchaSuccess = (data: any) => {
    setShowCaptcha(false);
    getSmsCode(data);
  };
  const smsApiMap: any = { email: getEmailSmsCode, phone: getPhoneSmsCode };
  // 获取验证码方法
  const getSmsCode = async (data: any) => {
    const params: any = {
      verification_request: data,
    };
    loginType === "email"
      ? (params["email"] = email)
      : (params["phone"] = phone);
    const res = await smsApiMap[loginType](params);
    if (res.errcode === 0) {
      setCanGetSms(false);
      countDown();
    }
  };
  // 倒计时
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const timer = useRef<any>(null);
  const countDown = () => {
    if (timeLeft <= 0) {
      clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setTimeLeft((pre) => pre - 1);
    }, 1000);
  };
  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(timer.current);
      setCanGetSms(true);
    }
  }, [timeLeft]);
  useEffect(() => {
    return () => {
      timer.current && clearInterval(timer.current);
    };
  }, []);

  // 邮箱/手机号登录
  const accountLoginApis: any = {
    email: loginByEmail,
    phone: loginByPhone,
  };
  const accountLogin = async () => {
    const params: any = {
      code: smsCode,
    };
    loginType === "email"
      ? (params["email"] = email)
      : (params["phone"] = `${prefix} ${phone}`);
    const res = await accountLoginApis[loginType](params);
    if (res.errcode === 0) {
      const { token, user_info } = res.data.login_response;
      loginSuccess(token, user_info);
    } else {
      message.error(res.msg);
    }
  };

  const loginSuccess = async (token: string, user_info: any) => {
    await dispatch(setUserInfo(user_info));
    await dispatch(setToken({ token }));
    localStorage.setItem("SPACEU_MARKET_TOKEN", token);
    await navigator("/");
  };

  // 三方登录
  const loginByGoogle = useGoogleLogin({
    onSuccess: (data: any) => {
      getGooleUserInfo(data.access_token, loginSuccess);
    },
  });
  const otherLogin = (type: string) => {
    switch (type) {
      case "google":
        loginByGoogle();
        break;
      case "facebook":
        loginByFaceBook(loginSuccess);
        break;
      case "apple":
        loginByApple(loginSuccess);
        break;
      case "wechat":
        loginByWechat(loginSuccess, "click");
        break;
      default:
        break;
    }
  };

  return (
    <div className="login-page">
      <div className="left page-part">
        <img
          src={require("../../assets/images/logo-white.png")}
          alt=""
          className="login-logo"
        />
      </div>
      <div className="right page-part">
        <p className="title">{t("login.title")}</p>
        {isSpaceULogin ? (
          <div>二维码</div>
        ) : (
          <div className="login-type">
            <div className="change-type_wrap">
              <button
                className={`type_btn ${loginType === "email" && "active-type"}`}
                onClick={() => changeLoginType("email")}
              >
                {t("login.type1")}
              </button>
              <div className="divide_line"></div>
              <button
                className={`type_btn ${loginType === "phone" && "active-type"}`}
                onClick={() => changeLoginType("phone")}
              >
                {t("login.type0")}
              </button>
            </div>
            <div className="login-form">
              <div className="form-item">
                {loginType === "email" ? (
                  <input
                    className="common-input form-common_style"
                    placeholder={`${t("login.email")}`}
                    onChange={(e: any) => setEmail(e.target.value)}
                  />
                ) : (
                  <div className="phone-login_wrap form-common_style">
                    <div className="prefix_wrap">
                      <PhonePrefix selectCode={(e: any) => setPrefix(e)} />
                    </div>
                    <input
                      className="phone-input"
                      placeholder={`${t("login.phone")}`}
                      onChange={(e: any) => setPhone(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="form-item">
                <div className="sms_wrap form-common_style">
                  <input
                    type="text"
                    placeholder={`${t("login.sms")}`}
                    className="sms-input"
                    onChange={(e: any) => setSmsCode(e.target.value)}
                  />
                  {canGetSms ? (
                    <button
                      className="get-sms_btn"
                      onClick={() => setShowCaptcha(true)}
                    >
                      {t("login.getSms")}
                    </button>
                  ) : (
                    <span className="get-sms_btn">{timeLeft}</span>
                  )}
                </div>
              </div>
              <button className="login-btn" onClick={accountLogin}>
                {t("login.btn")}
              </button>
            </div>
          </div>
        )}
        <div className="other-login_wrap">
          <p className="other-title">{t("login.other")}</p>
          <button
            className="login-btn spaceu-login"
            onClick={() => setIsSpaceULogin(true)}
          >
            {t("login.spaceu")}
          </button>
          <div className="quick-login_wrap">
            {quickLoginMap.map((v) => {
              return (
                <button
                  className="login-item"
                  key={v.icon}
                  onClick={() => otherLogin(v.name)}
                >
                  <i className={`iconfont ${v.icon}`}></i>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Captcha
        isOpen={showCaptcha}
        onClose={() => setShowCaptcha(false)}
        captchaSuccess={captchaSuccess}
      />
    </div>
  );
}
