<template>
  <div class="login-form flex flex-col items-center">
    <h1 class="text-h font-bold text-center mb-4 title">SpaceU</h1>
    <div class="form-item" v-show="loginType === 1">
      <div class="code-wrap">
        <PhonePrefix @select-code="(e) => (phonePrefix = e)" />
      </div>
      <div class="phone-w">
        <input
          type="text"
          v-model="loginForm.phone"
          class="w-[100%] h-11.5 rounded-input phone-input text-base common-input"
          placeholder="Phone number"
        />
        <p class="error-info flex items-center" v-if="isErrPhone">
          <i class="iconfont icon-warning"></i>
          <span>Error phone number</span>
        </p>
      </div>
    </div>
    <div class="form-item" v-show="loginType === 2">
      <div class="email-w">
        <input
          type="text"
          v-model="loginForm.email"
          class="w-[100%] h-11.5 rounded-input email-input text-base common-input"
          placeholder="Email"
        />
        <p class="error-info flex items-center" v-if="isErrEmail">
          <i class="iconfont icon-warning"></i>
          <span>Error email</span>
        </p>
      </div>
    </div>
    <div class="sms-code_wrap w-[100%] flex items-center justify-between">
      <div class="form-item_sms">
        <input
          type="text"
          v-model="loginForm.smsCode"
          class="w-30 h-11.5 rounded-input text-base common-input"
          placeholder="Verification code"
        />
        <p class="error-info flex items-center" v-if="isErrSms">
          <i class="iconfont icon-warning"></i>
          <span>Error sms code</span>
        </p>
      </div>
      <button
        class="sms-btn"
        @click="getSmsCodeBefore"
        :disabled="!canGetSmsCode"
      >
        {{ canGetSmsCode ? "SMS Code" : `${count}sResend later` }}
      </button>
    </div>
    <div
      class="captcha-wrap w-[100%] flex items-center justify-between"
      v-if="showCaptcha"
    >
      <Captcha @captchaSuccess="captchaSuccess" />
    </div>
    <button class="login-btn" @click="login">enter</button>
    <div class="other-login_ways">
      <p class="login-title flex justify-center items-center">Sign in with</p>
      <div class="login-btns flex justify-between items-center">
        <button
          v-for="item in loginOptions"
          :key="item.name"
          :class="['other-login_btn', `${item.name}_btn`]"
          @click="otherLogin(item.name)"
        ></button>
      </div>
    </div>
    <div class="form-footer flex justify-center items-center">
      <button class="footer-btn" @click="changeLoginType(loginType)">
        {{ loginType === 1 ? "Login by email" : "Login by phone" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { emailReg, getQueryString } from "@/utils/common";
import { useUser } from "@/stores/user";
import {
  googleLogin,
  facebookLogin,
  appleLogin,
  wechatLogin,
} from "@/utils/oauth";
import PhonePrefix from "./PhonePrefix.vue";
import $loading from "@/plugins/loading/package";
import $message from "@/plugins/message/package";
import Captcha from "./Captcha.vue";
import {
  loginByPhone,
  loginByEmail,
  getVerEmailSmsCode,
  getVerSmsCode,
} from "@/api/user";
import { useRouter, useRoute } from "vue-router";
import { userApiMap } from "@/api/index";
import Cookies from "js-cookie";
const userApi = userApiMap();

export default defineComponent({
  name: "LoginForm",
  components: { PhonePrefix, Captcha },
  setup() {
    onMounted(async () => {
      await nextTick();
      if (getQueryString("code")) {
        wechatLogin(userApi, loginSuccess, "load");
      }
    });
    const phonePrefix = ref("+86");
    const router = useRouter();
    const route = useRoute();
    const changeLoginType = (type: number) => {
      loginType.value = type === 1 ? 2 : 1;
      loginForm.smsCode = "";
      loginForm.email = "";
      loginForm.phone = "";
      isErrPhone.value = false;
      isErrSms.value = false;
      isErrEmail.value = false;
      canGetSmsCode.value = true;
      count.value = 60;
      clearInterval(timer.value);
    };
    const loginForm = reactive({
      phone: "",
      email: "",
      smsCode: "",
    });
    const isErrPhone = ref(false);
    watch(
      () => loginForm.phone,
      (value) => {
        if (!value) {
          isErrPhone.value = true;
        } else {
          isErrPhone.value = false;
        }
      }
    );
    const isErrEmail = ref(false);
    watch(
      () => loginForm.email,
      (value) => {
        if (!value) {
          isErrEmail.value = true;
        } else if (!emailReg(value)) {
          isErrEmail.value = true;
        } else {
          isErrEmail.value = false;
        }
      }
    );

    const showCaptcha = ref(false);
    const getSmsCodeBefore = () => {
      if (!canGetSmsCode.value) return;
      if (loginType.value === 1) {
        if (!loginForm.phone) {
          isErrPhone.value = true;
          return;
        }
        showCaptcha.value = true;
      } else {
        if (!emailReg(loginForm.email)) {
          isErrEmail.value = true;
          return;
        }
        showCaptcha.value = true;
      }
    };
    const captchaSuccess = (data: any) => {
      showCaptcha.value = false;
      getSmsCode(data);
    };
    const getSmsCode = async (data: any) => {
      $loading.showLoading("Loading...");
      if (loginType.value === 1) {
        const res: any = await getVerSmsCode({
          phone: `${phonePrefix.value}-${loginForm.phone}`,
          verification_request: data,
        });
        $loading.hideLoading();
        if (res.errcode === 0) {
          canGetSmsCode.value = false;
          countDown();
        } else {
          $message.error(res.msg);
        }
      } else {
        const res: any = await getVerEmailSmsCode({
          email: loginForm.email,
          verification_request: data,
        });
        $loading.hideLoading();
        if (res.errcode === 0) {
          canGetSmsCode.value = false;
          countDown();
        } else {
          $message.error(res.msg);
        }
      }
    };
    const isErrSms = ref(false);
    const canGetSmsCode = ref(true);
    const count = ref(60);
    watch(count, (value) => {
      if (value === 0) {
        clearInterval(timer.value);
        count.value = 60;
        canGetSmsCode.value = true;
      }
    });
    const timer = ref<any>(null);
    const countDown = () => {
      timer.value = setInterval(() => {
        count.value -= 1;
      }, 1000);
    };

    const login = () => {
      if (loginType.value === 1) {
        phoneLogin();
      } else {
        emailLogin();
      }
    };
    const emailLogin = async () => {
      if (isErrEmail.value || !loginForm.smsCode) {
        $message.error("Please fill in the email verification code");
        return;
      }
      $loading.showLoading("Loading...");
      const res: any = await loginByEmail({
        email: loginForm.email,
        code: loginForm.smsCode,
      });
      $loading.hideLoading();
      if (res.errcode === 0) {
        const { token, user_info } = res.data.login_response;
        const scene_instance_response = res.data.scene_instance_response;
        loginSuccess(token, user_info, scene_instance_response);
      } else {
        $message.error(res.msg);
      }
    };
    // login
    const userStore = useUser();
    const phoneLogin = async () => {
      if (isErrPhone.value || !loginForm.smsCode) {
        $message.error(
          "Please fill in the mobile phone number verification code"
        );
        return;
      }
      $loading.showLoading("Loading...");
      const res: any = await loginByPhone({
        phone: `${phonePrefix.value} ${loginForm.phone}`,
        code: loginForm.smsCode,
      });
      $loading.hideLoading();
      if (res.errcode === 0) {
        const { token, user_info } = res.data.login_response;
        const scene_instance_response = res.data.scene_instance_response;
        loginSuccess(token, user_info, scene_instance_response);
      } else {
        $message.error(res.msg);
      }
    };

    // 三方登录
    const otherLogin = (type: string) => {
      switch (type) {
        case "google":
          googleLogin(userApi, loginSuccess);
          break;
        case "facebook":
          facebookLogin(userApi, loginSuccess);
          break;
        case "apple":
          appleLogin(userApi, loginSuccess);
          break;
        case "wechat":
          wechatLogin(userApi, loginSuccess, "click");
          break;
        default:
          break;
      }
    };

    const loginSuccess = async (
      token: string,
      user_info: any,
      scene_instance_response: any
    ) => {
      if (window.location.host === "login.wdabuliu.com") {
        const redirect = route.query?.redirect;
        if (window.location.protocol === "https:") {
          Cookies.set("user_info", JSON.stringify(user_info), {
            domain: ".wdabuliu.com",
            sameSite: "none",
            secure: true,
          });
          Cookies.set("token", token, {
            domain: ".wdabuliu.com",
            sameSite: "none",
            secure: true,
          });
          Cookies.set(
            "scene_instance_response",
            JSON.stringify(scene_instance_response),
            {
              domain: ".wdabuliu.com",
              sameSite: "none",
              secure: true,
            }
          );
        } else {
          Cookies.set("user_info", JSON.stringify(user_info), {
            domain: ".wdabuliu.com",
          });
          Cookies.set("token", token, {
            domain: ".wdabuliu.com",
          });
          Cookies.set(
            "scene_instance_response",
            JSON.stringify(scene_instance_response),
            {
              domain: ".wdabuliu.com",
            }
          );
        }

        window.location.href = "https://" + redirect + ".wdabuliu.com";
      } else {
        userStore.setUserInfo(user_info);
        userStore.setToken(token);
        userStore.setSceneInstanceResponse(scene_instance_response);
        console.error(
          route.query?.instanceId,
          "route.query?.instanceId============"
        );
        if (route.query?.redirect) {
          router.push("/" + route.query?.redirect);
        } else if (route.query?.instanceId) {
          router.push({
            path: "/",
            query: {
              instanceId: route.query?.instanceId,
            },
          });
        } else {
          router.push({ path: "/" });
        }
      }
    };

    const loginOptions = [
      {
        name: "google",
      },
      {
        name: "facebook",
      },
      {
        name: "apple",
      },
      {
        name: "wechat",
      },
    ];

    const loginType = ref(1);

    return {
      loginForm,
      isErrPhone,
      getSmsCode,
      isErrSms,
      isErrEmail,
      canGetSmsCode,
      countDown,
      loginOptions,
      count,
      phoneLogin,
      otherLogin,
      phonePrefix,
      loginType,
      showCaptcha,
      getSmsCodeBefore,
      captchaSuccess,
      changeLoginType,
      login,
    };
  },
});
</script>

<style lang="scss" scoped>
.login-form {
  width: 306px;
  padding: 30px;
  box-sizing: border-box;
  background-color: $spaceUColor;
  border-radius: 36px;
  z-index: 9999999;
  .title {
    color: #fff;
  }
  .form-item {
    width: 100%;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
  }
  .form-item,
  .form-item_sms {
    position: relative;
  }
}
.common-input {
  border: 1px solid #fff;
  background-color: transparent;
  color: #fff;
  padding-left: 15px;
  box-shadow: none;
}
.phone-input {
  // width: 150px;
  border-radius: 0 22px 22px 0;
  border-left: none;
}
.email-w {
  width: 100%;
}
// .email-input {
//   width: 100%;
// }
.error-info {
  font-size: 12px;
  color: #f00;
  position: absolute;
  padding-left: 10px;
}
.sms-code_wrap {
  margin-bottom: 26px;
}
.captcha-wrap {
  margin-bottom: 26px;
}
.sms-btn {
  width: 110px;
  height: 46px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}
.login-btn {
  width: 100%;
  height: 46px;
  background-color: #fff;
  border-radius: 23px;
  color: $spaceUColor;
  font-weight: 500;
  margin-bottom: 32px;
}
.other-login_ways {
  .login-title {
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    line-height: 14px;
    margin-bottom: 15px;
  }
  .login-title::before,
  .login-title::after {
    content: "";
    width: 50px;
    height: 1px;
    background-color: #fff;
  }
  .login-title::before {
    margin-right: 8px;
  }
  .login-title::after {
    margin-left: 8px;
  }
  .login-btns {
    margin-bottom: 15px;
    .other-login_btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 20px;
    }
    .other-login_btn:last-child {
      margin-right: 0;
    }
    .google_btn {
      background-image: url(@/assets/images/icon-google.png);
      background-size: 100% 100%;
    }
    .facebook_btn {
      background-image: url(@/assets/images/icon-facebook.png);
      background-size: 100% 100%;
    }
    .apple_btn {
      background-image: url(@/assets/images/icon-apple.png);
      background-size: 100% 100%;
    }
    .wechat_btn {
      background-image: url(@/assets/images/icon-wechat.png);
      background-size: 100% 100%;
    }
  }
}
.form-footer {
  width: 100%;
  .footer-btn {
    font-size: 12px;
    color: #fff;
    font-weight: 700;
  }
  .manager-btn {
    margin-right: 36px;
  }
}
</style>
