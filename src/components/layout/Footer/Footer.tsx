import { FC } from "react";
import { useTranslation } from "react-i18next";
import "./footer.scss";

const Footer: FC = () => {
  const { t } = useTranslation();
  const navMap = [
    {
      key: "privacy",
      url: "https://node.wdabuliu.com/noteh5/#/pages/privacy/privacy",
    },
    {
      key: "protocol",
      url: "https://node.wdabuliu.com/noteh5/#/pages/argeement/argeement",
    },
    {
      key: "community",
      url: "https://node.wdabuliu.com/noteh5/#/pages/privacy/privacy",
    },
    {
      key: "contact",
      url: "https://node.wdabuliu.com/noteh5/#/pages/privacy/privacy",
    },
  ];

  const goPage = (url: string) => {
    window.open(url);
  };
  return (
    <div className="site-footer_wrap">
      <img
        src={require("@/assets/images/logo-white.png")}
        alt=""
        className="logo"
      />
      <p className="copyright">
        Copyright © 2020-2021 北京达不溜科技有限公司. All Rights Reserved.
        版权所有.{" "}
      </p>
      <div className="record_wrap">
        <img
          src={require("@/assets/images/record.png")}
          className="record-icon"
          alt=""
        />
        <p className="record">
          京ICP备 2021030216号-1 京公网安备 11010802037512号
        </p>
      </div>
      <div className="nav_wrap">
        {navMap.map((v) => {
          return (
            <button
              className="footer-nav_btn"
              key={v.key}
              onClick={() => goPage(v.url)}
            >
              {t(`footer.navs.${v.key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
