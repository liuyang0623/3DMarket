import { useState, FC } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { uploadFile } from "@/api/sys";
import { Upload, message, Select } from "antd";
import PhonePrefix from "@/components/common/phonePrefix/PhonePrefix";
import "@/components/common/modelUpload/index.scss";
import "@/components/common/form/index.scss";
import "./userSettings.scss";

export default function UserSettings() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("setAccount");
  const menus = ["material", "setAccount", "rePassword", "notify", "privacy"];
  const components: any = {
    material: () => <Material />,
    setAccount: () => <SetAccount />,
    rePassword: () => <RePassword />,
    notify: () => <RePassword />,
    privacy: () => <RePassword />,
  };
  const CurrentComponent = components[activeTab];

  return (
    <div className="page user-setting_page">
      <div className="content">
        <div className="left-menu_wrap">
          {menus.map((v) => {
            return (
              <button
                key={v}
                className={`menu_btn ${activeTab === v && "menu_btn-active"}`}
                onClick={() => setActiveTab(v)}
              >
                {t(`userSettings.tabs.${v}`)}
              </button>
            );
          })}
        </div>
        <div className="right-content_wrap">
          <p className="title">{t(`userSettings.${activeTab}.title`)}</p>
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
}

const Material: FC = () => {
  const { t } = useTranslation();

  const { user_info } = useAppSelector((state) => state.user);
  const { nickname, headimgurl, user_name } = user_info;

  const [headerImg, setHeaderImg] = useState(headimgurl);
  const [nickName, setNickName] = useState(nickname);
  const [sex, setSex] = useState(undefined);
  const [homeLink, setHomeLink] = useState("");
  const [desc, setDesc] = useState("");

  const sexOptions: any = [
    {
      label: t("userSettings.material.man"),
      value: 1,
    },
    {
      label: t("userSettings.material.woman"),
      value: 0,
    },
  ];

  const uploadHeaderImg = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadFile(formData);
    if (res.errcode === 0) {
      setHeaderImg(res.data.url);
    } else {
      message.error(res.msg);
    }
    return false;
  };
  return (
    <div className="form-part material">
      <div className="upload-header_wrap">
        <img src={headerImg} className="header-img" alt="" />
        <Upload
          accept=".png,.jpg,.jpeg,.webp"
          maxCount={1}
          showUploadList={false}
          beforeUpload={(file) => uploadHeaderImg(file)}
        >
          <button className="upload-btn">
            <span>{t("userSettings.material.upload")}</span>
          </button>
        </Upload>
      </div>
      <div className="form-item item-single">
        <span className="form-label">
          {t("userSettings.material.nickname")}
        </span>
        <input
          value={nickName}
          type="text"
          className="common-input name-input"
          placeholder={`${t("userSettings.placeholder.name")}`}
          onChange={(e: any) => setNickName(e.target.value)}
        />
      </div>
      <div className="item-single setting-item">
        <div className="form-item sex-item">
          <span className="form-label">{t("userSettings.material.sex")}</span>
          <Select
            className="common-select material-select"
            placeholder={`${t("userSettings.placeholder.none")}`}
            value={sex}
            options={sexOptions}
            onChange={(e) => setSex(e)}
          />
        </div>
        <div className="form-item">
          <span className="form-label">{t("userSettings.material.job")}</span>
          <Select
            className="common-select material-select"
            placeholder={`${t("userSettings.placeholder.none")}`}
            value={sex}
            options={sexOptions}
            onChange={(e) => setSex(e)}
          />
        </div>
      </div>
      <div className="form-item item-single">
        <span className="form-label">{t("userSettings.material.home")}</span>
        <input
          value={homeLink}
          type="text"
          className="common-input name-input full-input"
          placeholder={`${t("userSettings.placeholder.link")}`}
          onChange={(e: any) => setHomeLink(e.target.value)}
        />
      </div>
      <div className="form-item">
        <span className="form-label">{t("userSettings.material.desc")}</span>
        <textarea
          value={desc}
          className="common-input common-textarea"
          placeholder={`${t("userSettings.placeholder.desc")}`}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>
      <button className="footer-btn ok-btn save-btn">
        {t("userSettings.saveBtn")}
      </button>
    </div>
  );
};

const SetAccount: FC = () => {
  const { t } = useTranslation();

  const [prefix, setPrefix] = useState("+86");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [othersBindMap, setOthersBindMap] = useState([
    {
      key: "apple",
      icon: "icon-apple",
      isBind: false,
    },
    {
      key: "wechat",
      icon: "icon-wechat",
      isBind: false,
    },
    {
      key: "google",
      icon: "icon-google",
      isBind: false,
    },
    {
      key: "facebook",
      icon: "icon-facebook",
      isBind: false,
    },
  ]);
  return (
    <div className="form-part set-account">
      <div className="form-item item-single">
        <span className="form-label account-label">
          {t("userSettings.setAccount.phone")}
        </span>
        <div className="bind_wrap">
          <div className="phone_wrap">
            <PhonePrefix selectCode={(e: any) => setPrefix(e)} />
            <input
              value={phone}
              className="phone-input"
              placeholder={`${t("userSettings.placeholder.phone")}`}
              onChange={(e: any) => setPhone(e.target.value)}
            />
          </div>
          <button className="footer-btn ok-btn">
            {t("userSettings.nextBtn")}
          </button>
        </div>
      </div>
      <div className="form-item item-single">
        <span className="form-label account-label">
          {t("userSettings.setAccount.email")}
        </span>
        <div className="bind_wrap">
          <input
            value={email}
            type="text"
            className="common-input name-input"
            placeholder={`${t("userSettings.placeholder.email")}`}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <button className="footer-btn ok-btn">
            {t("userSettings.nextBtn")}
          </button>
        </div>
      </div>
      <div className="form-item item-single">
        <span className="form-label">
          {t("userSettings.setAccount.others")}
        </span>
        <p className="item-desc">{t("userSettings.setAccount.othersDesc")}</p>
        <div className="others-bind_wrap">
          {othersBindMap.map((v) => {
            return (
              <div className="bind-item" key={v.key}>
                <span className="sign">
                  <i className={`iconfont ${v.icon}`}></i>
                </span>
                <button className="footer-btn bind-account_btn">
                  {t("userSettings.setAccount.bindBtn")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="form-item">
        <span className="form-label">
          {t("userSettings.setAccount.logout")}
        </span>
        <p className="item-desc">{t("userSettings.setAccount.logoutDesc")}</p>
        <button className="footer-btn bind-account_btn">
          {t("userSettings.setAccount.logout")}
        </button>
      </div>
    </div>
  );
};

const RePassword: FC = () => {
  const { t } = useTranslation();

  const [curPassword, setCurPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  return (
    <div className="form-part set-account">
      <div className="form-item item-single">
        <input
          value={curPassword}
          type="text"
          className="common-input name-input"
          placeholder={`${t("userSettings.placeholder.password")}`}
          onChange={(e: any) => setCurPassword(e.target.value)}
        />
      </div>
      <div className="form-item item-single">
        <input
          value={newPassword}
          type="password"
          className="common-input name-input"
          placeholder={`${t("userSettings.placeholder.newPassword")}`}
          onChange={(e: any) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="form-item item-single">
        <input
          value={confirmNewPassword}
          type="password"
          className="common-input name-input"
          placeholder={`${t("userSettings.placeholder.confirmPassword")}`}
          onChange={(e: any) => setConfirmNewPassword(e.target.value)}
        />
      </div>
      <button className="footer-btn ok-btn save-btn">
        {t("userSettings.saveBtn")}
      </button>
    </div>
  );
};
