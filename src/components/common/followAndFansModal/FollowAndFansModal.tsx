import { FC, useState, useEffect, useCallback } from "react";
import { message, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { getFollowAndFansList, changeFollow } from "@/api/user";
import { deepClone } from "@/utils/common";
import "./followAndFansModal.scss";

interface FollowAndFansModalPropsI {
  type: 1 | 2;
  userId: string;
  isOpen: boolean;
  onCancel: Function;
}

const FollowAndFansModal: FC<FollowAndFansModalPropsI> = (props) => {
  const { isOpen, onCancel, type, userId } = props;
  const { t } = useTranslation();
  const btnIcons: any = {
    0: "icon-add-user",
    1: "icon-user",
    2: "icon-users",
  };

  const [pageNum, setPageNum] = useState(0);
  const [userList, setUserList] = useState<any>([]);
  const getFollowsAndFans = useCallback(async () => {
    const res = await getFollowAndFansList({
      type,
      my_user_id: userId,
      page_size: 30,
      page_number: pageNum,
    });
    if (res.errcode === 0) {
      setUserList((pre: any) => [...pre, ...res.data.list]);
    } else {
      message.error(res.msg);
    }
  }, [pageNum, type, userId]);
  useEffect(() => {
    setPageNum(0);
    setUserList([]);
    getFollowsAndFans();
  }, [getFollowsAndFans]);
  const switchFollow = async (data: any, index: number) => {
    const res = await changeFollow({
      opt: data.follow_info.follow_status === 0 ? 1 : 2,
      user_id: data.user_id || "",
    });
    if (res.errcode === 0) {
      const tempUserList = userList;
      if (tempUserList[index].follow_info.follow_status !== 0) {
        tempUserList[index].follow_info.follow_status = 0;
        setUserList(deepClone(tempUserList));
      } else {
        setUserList([]);
        getFollowsAndFans();
      }
    }
  };
  return (
    <Modal
      wrapClassName="user-modal"
      onCancel={() => onCancel()}
      open={isOpen}
      footer={false}
      width={620}
    >
      <div className="user-model_content">
        <div className="modal-title">
          {type === 1
            ? t("user.userCenter.myFollow")
            : t("user.userCenter.myFans")}
        </div>
        <div className="list_wrap">
          {userList.map((v: any, index: number) => {
            return (
              <div className="user-item" key={v.id}>
                <div className="item-left">
                  <img src={v.headimgurl} className="user-header" alt="" />
                  <span className="user-name">{v.user_name || "未命名"}</span>
                </div>
                <button
                  className={`user-action_btn follow-btn user-action_btn${v.follow_info?.follow_status}`}
                  onClick={() => switchFollow(v, index)}
                >
                  <i
                    className={`iconfont ${
                      btnIcons[v.follow_info.follow_status]
                    }`}
                  ></i>
                  {v.follow_info.follow_status === 0
                    ? t("user.focus")
                    : v.follow_info.follow_status === 1
                    ? t("user.focused")
                    : t("user.together")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default FollowAndFansModal;
