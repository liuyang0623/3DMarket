import service from "../utils/request";

enum Api {
  GetSmsCode = "/note/ssoserver/sliding/verification/sms",
  GetEmailSmsCode = "/note/ssoserver/sliding/verification/email",
  LoginByPhone = "/note/ssoserver/phone/login/by/code",
  LoginByEmail = "/note/ssoserver/email/login/by/code",
  GoogleLogin = "/note/ssoserver/googlelogin",
  FacebookLogin = "/note/ssoserver/facebook/login",
  AppleLogin = "/note/ssoserver/applelogin/customize",
  WechatLogin = "/note/ssoserver/wechatlogin",
  PullUserInfo = "/note/ssoserver/pullUserInfo",
  ChangeFollow = "/note/ssoserver/library/optFollowRelation",
  IfFollow = "/note/ssoserver/library/ifFollow",
  GetFollowAndFansList = "/note/ssoserver/library/getFollowRelationList",
  GetTotalRecord = "/note/library/to/c/get/total/record",
}
interface GetPhoneSmsCodeInterface {
  phone: string;
  verification_request: any;
}
const getPhoneSmsCode = (params: GetPhoneSmsCodeInterface) => {
  return service.post(Api.GetSmsCode, params);
};
interface GetEmailSmsCodeInterface {
  email: string;
  verification_request: any;
}
const getEmailSmsCode = (params: GetEmailSmsCodeInterface) => {
  return service.post(Api.GetEmailSmsCode, params);
};

interface LoginByPhoneInterface {
  phone: string;
  code: string;
}
const loginByPhone = (params: LoginByPhoneInterface) => {
  return service.post(Api.LoginByPhone, params);
};

interface LoginByEmailInterface {
  email: string;
  code: string;
}
const loginByEmail = (params: LoginByEmailInterface) => {
  return service.post(Api.LoginByEmail, params);
};

interface GoogleLoginInterface {
  google_user_id: string;
  email: string;
  name: string;
  picture_url: string;
  family_name: string;
  given_name: string;
}
const googleLogin = (params: GoogleLoginInterface) => {
  return service.post(Api.GoogleLogin, params);
};

interface FbLoginInterface {
  fb_user_id: string;
  fb_email: string;
  fb_name: string;
  fb_header_url: string;
}
const facebookLogin = (params: FbLoginInterface) => {
  return service.post(Api.FacebookLogin, params);
};

interface AppleLoginInterface {
  token: string;
}
const appleLogin = (params: AppleLoginInterface) => {
  return service.get(Api.AppleLogin, params);
};

interface WechatLoginInterface {
  type: string;
  code: string;
}
const wechatLogin = (params: WechatLoginInterface) => {
  return service.get(Api.WechatLogin, params);
};

interface PullUserInfoParamsI {
  user_id?: string;
}
const pullUserInfo = (params: PullUserInfoParamsI) => {
  return service.get(Api.PullUserInfo, params);
};

interface ChangeFollowParamsI {
  opt: 1 | 2;
  my_user_id?: string;
  user_id: string;
}
const changeFollow = (params: ChangeFollowParamsI) => {
  return service.get(Api.ChangeFollow, params);
};

interface IfFollowParamsI {
  my_user_id?: string;
  user_id: string;
}
const getIfFollow = (params: IfFollowParamsI) => {
  return service.get(Api.IfFollow, params);
};

interface GetFollowAndFansListParamsI {
  type: 1 | 2;
  my_user_id?: string;
  page_size: number;
  page_number: number;
}
const getFollowAndFansList = (params: GetFollowAndFansListParamsI) => {
  return service.get(Api.GetFollowAndFansList, params);
};

interface GetTotalRecordParamsI {
  user_id?: string;
}
const getTotalRecord = (params: GetTotalRecordParamsI) => {
  return service.get(Api.GetTotalRecord, params);
};

export {
  getPhoneSmsCode,
  getEmailSmsCode,
  loginByPhone,
  loginByEmail,
  googleLogin,
  facebookLogin,
  appleLogin,
  wechatLogin,
  pullUserInfo,
  changeFollow,
  getIfFollow,
  getFollowAndFansList,
  getTotalRecord
};
