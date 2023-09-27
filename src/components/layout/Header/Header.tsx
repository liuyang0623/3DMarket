import { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setParams } from "@/store/modules/model";
import { getUserInfo } from "@/store/modules/user";
import UploadModal from "@/components/common/modelUpload/uploadModal/UploadModal";
import ModelOperate from "@/components/common/modelUpload/modelOperate/ModelOperate";
import UserInfoPane from "@/components/common/userInfoPane/UserInfoPane";
import ShoppingCart from "@/components/common/shoppingCart/ShoppingCart";
import MessageBox from "@/components/common/messageBox/MessageBox";
import "./header.scss";

const Header: FC = () => {
  const { t } = useTranslation();
  const { token, user_info } = useAppSelector((state) => state.user);
  const { shoppingCart } = useAppSelector((state) => state.shoppingCart);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const [showUpload, setShowUpload] = useState(false);

  const navMap = ["source", "teach", "download"];
  const goPage = (type: string) => {
    switch (type) {
      case "source":
        navigator("/");
        break;
      default:
        break;
    }
  };
  const actionMap = [
    {
      icon: "icon-car",
      key: "shoppingCart",
      show: true,
    },
    {
      icon: "icon-message",
      key: "message",
      show: !!token,
    },
    {
      icon: "icon-upload3",
      key: "upload",
      show: !!token,
    },
  ];
  const [name, setName] = useState("");
  const searchModelList = async (e: any) => {
    if (e.keyCode === 13) {
      // 更新搜索参数
      await dispatch(
        setParams({
          name,
        })
      );
      if (pathname !== "/") {
        await navigator("/");
      }
    }
  };

  const headerAction = (key: string) => {
    switch (key) {
      case "upload":
        setShowUpload(true);
        break;
      default:
        break;
    }
  };

  const operateSuccess = () => {
    setShowUpload(false);
    window.location.reload();
  };

  // 每次刷新的时候更新一下个人信息
  useEffect(() => {
    if (token) {
      dispatch(getUserInfo());
    }
  }, [token, dispatch]);

  const [showCart, setShowCart] = useState(false);

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageList, setMessageList] = useState<Array<any>>([
    {
      id: 1,
      type: 0,
      title: '系统消息',
      content: '消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
      time: 1683627813433
    },
    {
      id: 2,
      type: 1,
      title: '',
      content: '消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
      user_info: {
        header_img: '',
        user_name: 'xxx'
      },
      time: 1683627813433
    },
    {
      id: 3,
      type: 1,
      title: '',
      content: '消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
      user_info: {
        header_img: '',
        user_name: 'xxx'
      },
      time: 1683627813433
    },
    {
      id: 4,
      type: 1,
      title: '',
      content: '消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
      user_info: {
        header_img: '',
        user_name: 'xxx'
      },
      time: 1683627813433
    },
    {
      id: 5,
      type: 1,
      title: '',
      content: '消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
      user_info: {
        header_img: '',
        user_name: 'xxx'
      },
      time: 1683627813433
    },
    {
      id: 6,
      type: 1,
      title: '',
      content: '消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
      user_info: {
        header_img: '',
        user_name: 'xxx'
      },
      time: 1683627813433
    },
    {
      id: 7,
      type: 1,
      title: '',
      content: '消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
      user_info: {
        header_img: '',
        user_name: 'xxx'
      },
      time: 1683627813433
    },
    {
      id: 8,
      type: 1,
      title: '',
      content: '消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
      user_info: {
        header_img: '',
        user_name: 'xxx'
      },
      time: 1683627813433
    },
    {
      id: 9,
      type: 1,
      title: '',
      content: '消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
      user_info: {
        header_img: '',
        user_name: 'xxx'
      },
      time: 1683627813433
    },
    {
      id: 10,
      type: 1,
      title: '',
      content: '消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
      user_info: {
        header_img: '',
        user_name: 'xxx'
      },
      time: 1683627813433
    },
    {
      id: 11,
      type: 1,
      title: '',
      content: '消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
      user_info: {
        header_img: '',
        user_name: 'xxx'
      },
      time: 1683627813433
    },
    {
      id: 12,
      type: 1,
      title: '',
      content: '消息消息消息消息消息消息消息消息消息消息消息消息消息消息',
      user_info: {
        header_img: '',
        user_name: 'xxx'
      },
      time: 1683627813433
    },
  ]);

  return (
    <div className="header">
      <div className="left">
        <img
          className="logo"
          src={require("@/assets/images/logo.png")}
          alt=""
          onClick={() => navigator("/")}
        />
        <ul className="nav_wrap">
          {navMap.map((v: string) => {
            return (
              <li className="nav-item" key={v} onClick={() => goPage(v)}>
                {t(`header.nav.${v}`)}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="right">
        <div className="input_wrap">
          <i className="iconfont icon-find"></i>
          <input
            value={name}
            type="text"
            placeholder={`${t("header.search")}`}
            className="search-input"
            onChange={(e: any) => setName(e.target.value)}
            onKeyDown={(e: any) => searchModelList(e)}
          />
        </div>
        <div className="action_wrap">
          {actionMap.map((v) => {
            return (
              v.show &&
              (v.key === "shoppingCart" ? (
                <ShoppingCart
                  key={v.key}
                  isOpen={showCart}
                  onClose={(e: any) => setShowCart(e)}
                  innerBtn={
                    <Badge count={shoppingCart.length} color="#7700a1">
                      <button
                        className="action-item shopping-cart_btn"
                        onClick={() => setShowCart(!showCart)}
                      >
                        <i className={`iconfont ${v.icon}`}></i>
                      </button>
                    </Badge>
                  }
                />
              ) : v.key === "message" ? (
                <MessageBox
                  key={v.key}
                  isOpen={showMessageBox}
                  onClose={(e: any) => setShowMessageBox(e)}
                  message={messageList}
                  innerBtn={
                    <Badge count={10} color="#7700a1">
                      <button
                        className="action-item shopping-cart_btn"
                        onClick={() => setShowMessageBox(!showMessageBox)}
                      >
                        <i className={`iconfont ${v.icon}`}></i>
                      </button>
                    </Badge>
                  }
                />
              ) : (
                <button
                  className="action-item upload-item"
                  key={v.key}
                  onClick={() => headerAction(v.key)}
                >
                  <i className={`iconfont ${v.icon}`}></i>
                </button>
              ))
            );
          })}
        </div>
        {token ? (
          <UserInfoPane
            innerBtn={
              <img
                className="header-img"
                src={user_info.headimgurl}
                onClick={() => navigator("/userCenter")}
                alt=""
              />
            }
          />
        ) : (
          <button className="login-btn" onClick={() => navigator("/login")}>
            {t("header.login")}
          </button>
        )}
      </div>
      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        modalInner={
          <ModelOperate
            type="add"
            title={`${t("model.operate.upload.title")}`}
            onClose={() => setShowUpload(false)}
            onSuccess={operateSuccess}
          />
        }
      />
    </div>
  );
};

export default Header;
