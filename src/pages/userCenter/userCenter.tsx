import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import { copyTextToClipboard } from "@/hooks/useCopyToClipboard";
import {
  pullUserInfo,
  changeFollow,
  getIfFollow,
  getTotalRecord,
} from "@/api/user";
import { getModelList } from "@/api/model";
import UserCenterFilter from "@/components/common/userCenterFilter/UserCenterFilter";
import UploadModal from "@/components/common/modelUpload/uploadModal/UploadModal";
import ModelOperate from "@/components/common/modelUpload/modelOperate/ModelOperate";
import CollectionOperate from "@/components/common/modelUpload/collectionOperate/CollectionOperate";
import ModelCard from "@/components/common/modelCard/ModelCard";
import FollowAndFansModal from "@/components/common/followAndFansModal/FollowAndFansModal";
import "./userCenter.scss";
import { message, Popover } from "antd";

export default function UserCenter() {
  const { t } = useTranslation();
  // 有user_id为自己的主页否则是他人的主页
  const { id } = useParams();
  const { user_info } = useAppSelector((state) => state.user);
  const { user_id } = user_info;
  const [userInfo, setUserInfo] = useState<any>({});
  const [focusNum, setFocusNum] = useState(0);
  const [fansNum, setFansNum] = useState(0);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userListType, setUserListType] = useState<1 | 2>(1);
  const userAction = (type: 1 | 2) => {
    if (id) return;
    setUserListType(type);
    setShowUserModal(true);
  };

  const [moneyNum, setMoneyNum] = useState(0);
  const [tagsMap, setTagsMap] = useState([
    {
      key: "trade",
      value: 0,
      icon: "icon-car",
    },
    {
      key: "view",
      value: 0,
      icon: "icon-view",
    },
    {
      key: "like",
      value: 0,
      icon: "icon-like",
    },
    {
      key: "share",
      value: 0,
      icon: "icon-like",
    },
  ]);

  // 获取主页数据
  const getUserCenterData = useCallback(async () => {
    const res = await getTotalRecord({ user_id: id ? id : user_id });
    if (res.errcode === 0) {
      const {
        my_balance,
        my_follow_num,
        my_fans_num,
        my_sold_num,
        view_me_num,
        my_like_num,
        share_me_num,
      } = res.data;
      setFocusNum(my_follow_num);
      setFansNum(my_fans_num);
      setMoneyNum(my_balance);
      setTagsMap([
        {
          key: "trade",
          value: my_sold_num,
          icon: "icon-car",
        },
        {
          key: "view",
          value: view_me_num,
          icon: "icon-view",
        },
        {
          key: "like",
          value: my_like_num,
          icon: "icon-like",
        },
        {
          key: "share",
          value: share_me_num,
          icon: "icon-like",
        },
      ]);
    }
  }, [user_id, id]);
  useEffect(() => {
    getUserCenterData();
  }, [getUserCenterData]);

  // 获取别人的用户信息
  const getUserInfo = useCallback(async () => {
    const res = await pullUserInfo({ user_id: id });
    if (res.errcode === 0) {
      setUserInfo(res.data);
    }
  }, [id]);
  // 关注用户
  const [isFollow, setIsFollow] = useState<0 | 1 | 2>(0); // 是否关注用户 0:未关注1:已关注2:已互关
  const followUser = async () => {
    const res = await changeFollow({
      opt: isFollow === 0 ? 1 : 2,
      // my_user_id: user_id,
      user_id: id || "",
    });
    if (res.errcode === 0) {
      message.success("success");
      getUserIsFollow();
    } else {
      message.error(res.msg);
    }
  };
  // 获取我对该用户的关注状态
  const btnIcons = {
    0: "icon-add-user",
    1: "icon-user",
    2: "icon-users",
  };
  const getUserIsFollow = useCallback(async () => {
    const res = await getIfFollow({
      user_id: id || "",
    });
    if (res.errcode === 0) {
      setIsFollow(res.data.follow_status);
    }
  }, [id]);
  useEffect(() => {
    if (id && user_id) {
      getUserIsFollow();
    }
  }, [id, user_id, getUserIsFollow]);

  const shareUserLink = () => {
    const { host, protocol, pathname } = window.location;
    const link = `${protocol}//${host}${
      pathname.indexOf("userCenter") !== -1 ? `/user/${user_id}` : `/user/${id}`
    }`;
    const res = copyTextToClipboard(link);
    if (res) {
      message.success("success");
    }
  };

  const [myOptions, setMyOptions] = useState([
    {
      btnText: t("user.userCenter.tab.public"),
      key: 1,
      num: 24,
    },
    {
      btnText: t("user.userCenter.tab.draft"),
      key: 4,
      num: 2234,
    },
    {
      btnText: t("user.userCenter.tab.get"),
      key: 2,
      num: 24,
    },
    {
      btnText: t("user.userCenter.tab.like"),
      key: 3,
      num: 0,
    },
  ]);
  const [otherOptions, setOtherOptions] = useState([
    {
      btnText: t("user.userCenter.otherTab.public"),
      key: 1,
      num: 24,
    },
    {
      btnText: t("user.userCenter.otherTab.like"),
      key: 3,
      num: 0,
    },
  ]);
  const modelTypeOptions = [
    {
      btnText: t("filter.userFilter.all"),
      value: "",
    },
    {
      btnText: t("filter.userFilter.single"),
      value: 0,
    },
    {
      btnText: t("filter.userFilter.collection"),
      value: 1,
    },
  ];

  const [filterParams, setFilterParams] = useState({
    listType: 1,
    filterType: 0,
    modelType: "",
  });
  const [pageNum, setPageNum] = useState(0);
  const [modelList, setModelList] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const getUserCenterModelList = useCallback(
    async (userId: string) => {
      const params: any = {
        user_id: userId,
        list_type: filterParams.listType,
        if_collection: filterParams.modelType,
        order_by_type: filterParams.filterType,
        page_size: 30,
        page_number: pageNum,
      };
      const res = await getModelList(params);
      if (res.errcode === 0) {
        setModelList((pre: any) => [...pre, ...res.data.list]);
        setHasMore(res.data.has_more);
      } else {
        message.error(res.msg);
      }
    },
    [filterParams, pageNum]
  );

  const operateSuccess = () => {
    setShowEditModal(false);
    setShowCreateModal(false);
    setPageNum(0);
    setModelList([]);
    setHasMore(true);
    getUserCenterModelList(user_id);
  };

  useEffect(() => {
    if (id) {
      getUserCenterModelList(id);
    } else {
      getUserCenterModelList(user_id);
    }
  }, [getUserCenterModelList, user_id, id]);

  useEffect(() => {
    if (!id) {
      setUserInfo(user_info);
    } else {
      getUserInfo();
    }
  }, [id, user_info, getUserInfo]);

  // 保存编辑数据
  const [curEditData, setCurEditData] = useState<any>({});
  // 创建合集
  const [operateType, setOperateType] = useState<"add" | "edit">("add");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 编辑单个模型
  const [showEditModal, setShowEditModal] = useState(false);
  const editModel = (data: any) => {
    setCurEditData(data);
    if (data.if_collection === 1) {
      setShowCreateModal(true);
      setOperateType("edit");
    } else {
      setShowEditModal(true);
    }
  };

  return (
    <div className="page user-center-page">
      <div className="user-info_top">
        <img src={userInfo.headimgurl} className="user-header_img" alt="" />
        <div className="user-info_wrap">
          <p className="user-name">{userInfo.nickname}</p>
          <div className="per-data_wrap">
            <span className="data-item" onClick={() => userAction(1)}>
              {focusNum} {t("user.userCenter.focus")}
            </span>
            <span className="dot"></span>
            <span className="data-item" onClick={() => userAction(2)}>
              {fansNum} {t("user.userCenter.fans")}
            </span>
          </div>
          <div className="action_wrap">
            {id ? (
              <button
                className={`user-action_btn follow-btn user-action_btn${isFollow}`}
                onClick={followUser}
              >
                <i className={`iconfont ${btnIcons[isFollow]}`}></i>
                {isFollow === 0
                  ? t("user.userCenter.focus")
                  : isFollow === 1
                  ? t("user.focused")
                  : t("user.together")}
              </button>
            ) : (
              <button className="user-action_btn">
                {t("user.userCenter.edit")}
              </button>
            )}
            <button className="user-action_btn" onClick={shareUserLink}>
              {t("user.userCenter.share")}
            </button>
            {id && (
              <Popover
                placement="bottom"
                content={
                  <button
                    style={{
                      width: "156px",
                      color: "#7700a1",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {t("user.userCenter.report")}
                  </button>
                }
              >
                <button className="user-action_btn">
                  <i className="iconfont icon-more1"></i>
                </button>
              </Popover>
            )}
          </div>
          <div className="tag_wrap">
            {!id && (
              <div className="tag-item">
                <span className="tag-title">
                  {t("user.userCenter.tags.money")}
                </span>
                <i className="iconfont icon-money3"></i>
                <span className="common-text price-text">{moneyNum}</span>
              </div>
            )}
            {tagsMap.map((v: any) => {
              return (
                <div className="tag-item" key={v.key}>
                  <i className={`iconfont ${v.icon}"}`}></i>
                  <span className={`common-text`}>{v.value}</span>
                  <span className="common-text">
                    {t("user.userCenter.tags.unit")}
                    {t(`user.userCenter.tags.${v.key}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="filter-wrap">
        <UserCenterFilter
          options={id ? otherOptions : myOptions}
          onChange={(e: any) => {
            setModelList([]);
            setPageNum(0);
            setHasMore(true);
            setFilterParams({
              ...filterParams,
              ...e,
            });
          }}
        />
      </div>
      <div className="user-center_body">
        <div className="body-top">
          <div className="model-type_wrap">
            {modelTypeOptions.map((v: any) => {
              return (
                <button
                  key={v.value}
                  className={`model-type_btn ${
                    filterParams.modelType === v.value
                      ? "model-type_btn-active"
                      : "model-type_btn-inactive"
                  }`}
                  onClick={() => {
                    setModelList([]);
                    setPageNum(0);
                    setHasMore(true);
                    setFilterParams({
                      ...filterParams,
                      modelType: v.value,
                    });
                  }}
                >
                  {v.btnText}
                </button>
              );
            })}
          </div>
          {!id && (
            <button
              className="create-collection_btn"
              onClick={() => {
                setOperateType("add");
                setShowCreateModal(true);
              }}
            >
              <i className="iconfont icon-add3"></i>
              <span>{t("model.operate.upload.uploadCollection")}</span>
            </button>
          )}
        </div>
        <div className="body-main">
          {modelList.length > 0 ? (
            <div className="list_wrap">
              <div className="content model-list_wrap">
                {modelList.map((v: any) => {
                  return (
                    <div className="card_wrap" key={v.id}>
                      <ModelCard data={v} type="list" onEdit={editModel} />
                    </div>
                  );
                })}
              </div>
              {hasMore && (
                <div className="bottom-btn_wrap">
                  <button
                    className="load-more_btn"
                    onClick={() => setPageNum(pageNum + 1)}
                  >
                    {t("model.loadMore")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="content center-empty empty-style">
              <img
                src={require("../../assets/images/empty.png")}
                className="empty-img"
                alt=""
              />
              <div className="text_wrap">
                <p className="title text">{t("prompt.empty")}</p>
                <p className="desc text">{t("prompt.emptyText")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <UploadModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        modalInner={
          <CollectionOperate
            type={operateType}
            userId={user_id}
            editData={curEditData}
            title={`${
              operateType === "add"
                ? t("model.operate.upload.uploadCollection")
                : t("model.operate.upload.editCollection")
            }`}
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => operateSuccess()}
          />
        }
      />
      <UploadModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        modalInner={
          <ModelOperate
            type="edit"
            title={`${t("model.operate.upload.edit")}`}
            modelData={curEditData}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => operateSuccess()}
          />
        }
      />
      {user_id && <FollowAndFansModal
        isOpen={showUserModal}
        onCancel={() => setShowUserModal(false)}
        type={userListType}
        userId={id ? id : user_id}
      />}
    </div>
  );
}
