import { FC, ReactNode, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Popover } from "antd";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { getTotalRecord } from "@/api/user";
import "./userInfoPane.scss";

interface UserInfoPanePropsI {
  innerBtn: ReactNode;
}

const UserInfoPane: FC<UserInfoPanePropsI> = (props) => {
  const { innerBtn } = props;
  return (
    <Popover className="user-info_pop" content={<PopoverContent />}>
      {innerBtn}
    </Popover>
  );
};

const PopoverContent: FC = () => {
  const { user_info } = useAppSelector((state) => state.user);
  const { user_id } = user_info;
  const { t } = useTranslation();
  const navigator = useNavigate();

  const [balance, setBalance] = useState(0);
  const [follow, setFollow] = useState(0);
  const [fans, setFans] = useState(0);

  const getPaneNum = useCallback(async () => {
    const res = await getTotalRecord({ user_id });
    if (res.errcode === 0) {
      const { my_balance, my_follow_num, my_fans_num } = res.data;
      setBalance(my_balance);
      setFollow(my_follow_num);
      setFans(my_fans_num);
    }
  }, [user_id]);
  useEffect(() => {
    getPaneNum();
  }, [getPaneNum]);

  const listMenu = [
    {
      icon: "icon-upload3",
      label: t("user.userCenter.tab.public"),
    },
    {
      icon: "icon-like",
      label: t("user.userCenter.tab.collect"),
    },
    // {
    //   icon: "icon-clock",
    //   label: t("user.userCenter.tab.view"),
    // },
  ];
  const logout = async () => {
    await localStorage.clear();
    navigator("/login");
  };
  return (
    <div className="userinfo-pop_content">
      <div className="info_top">
        <div className="user_base">
          <img src={user_info.headimgurl} className="user-header" alt="" />
          <span className="user-name">{user_info.nickname}</span>
        </div>
        <div className="user-num_wrap">
          <div className="num-item">
            <span className="num">
              <i className="iconfont icon-money3"></i>
              {balance}
            </span>
            <span className="unit">{t("user.userCenter.balance")}</span>
          </div>
          <div className="num-item">
            <span className="num">{follow}</span>
            <span className="unit">{t("user.userCenter.focus")}</span>
          </div>
          <div className="num-item">
            <span className="num">{fans}</span>
            <span className="unit">{t("user.userCenter.fans")}</span>
          </div>
        </div>
        <ul className="list-menu">
          {listMenu.map((v) => {
            return (
              <li className="list-item" key={v.icon}>
                <i className={`iconfont ${v.icon}`}></i>
                <span className="label">{v.label}</span>
              </li>
            );
          })}
        </ul>
        <div className="list-item border-bottom">
          <i className="iconfont icon-user"></i>
          <span className="label">{t("user.action.manager")}</span>
        </div>
        <div className="list-item" onClick={logout}>
          <i className="iconfont icon-logout"></i>
          <span className="label">{t("user.action.logout")}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfoPane;
