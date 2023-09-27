import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input, message } from "antd";
import { formatDate, getFileSize } from "@/utils/common";
import ModelView from "@/components/common/modelView/ModelView";
import ModelCard from "@/components/common/modelCard/ModelCard";
import {
  getModelDetail,
  getLikeList,
  getModelCollectionList,
} from "@/api/model";
import "./detail.scss";

export default function Detail() {
  const { id, type } = useParams();
  const { t } = useTranslation();
  const { TextArea } = Input;
  const [modelData, setModelData] = useState<any>({});
  const renderKeys = [
    {
      key: "create_time",
      icon: "icon-clock",
      label: t("model.detail.time"),
      render: (text: any) => {
        return formatDate(text);
      },
    },
    {
      key: "size",
      icon: "icon-folder",
      label: t("model.detail.size"),
      render: (text: any) => {
        return getFileSize(text);
      },
    },
    {
      key: "describe",
      icon: "icon-file",
      label: t("model.detail.desc"),
    },
    {
      key: "labels",
      icon: "icon-tag",
      label: t("model.detail.tag"),
      render: (text: any) => {
        return (
          <div>
            {text?.map((v: any) => {
              return (
                <span className="tag" key={v.id}>
                  #{v.name}
                </span>
              );
            })}
          </div>
        );
      },
    },
  ];

  const [maybeLikeList, setMaybeLikeList] = useState<Array<any>>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const getMaybeLikeList = useCallback(
    async (ids: any) => {
      const res = await getLikeList({
        page_number: pageNumber,
        page_size: 30,
        category_ids: ids.join(","),
      });
      if (res.errcode === 0) {
        setMaybeLikeList((pre) => [...pre, ...res.data.list]);
      } else {
        message.error(res.msg);
      }
    },
    [pageNumber]
  );

  const [curCategoreIds, setCurCategoreIds] = useState([]);
  const getModelDetailFunc = useCallback(
    async (id: number | string) => {
      const res = await getModelDetail({ model_id: id });
      if (res.errcode === 0) {
        if (type === "collection") {
          getCollectionModelList(id);
        } else {
          setModelData(res.data);
          const ids: any = [];
          res.data.category.forEach((v: any) => {
            ids.push(v.id);
          });
          setCurCategoreIds(ids);
        }
      } else {
        message.error(res.msg);
      }
    },
    [type]
  );

  const [collectionList, setCollectionList] = useState<Array<any>>([]);
  const getCollectionModelList = async (id: number | string) => {
    const res = await getModelCollectionList({ model_list_id: id });
    if (res.errcode === 0) {
      setCollectionList(res.data);
      setModelData(res.data[0]);
      const ids: any = [];
      res.data.forEach((v: any) => {
        v.category.forEach((v2: any) => {
          if (!ids.includes(v2.id)) {
            ids.push(v2.id);
          }
        });
      });
      setCurCategoreIds(ids);
    } else {
      message.error(res.msg);
    }
  };

  useEffect(() => {
    if (id) {
      getModelDetailFunc(id);
    }
  }, [id, getModelDetailFunc]);

  useEffect(() => {
    if (curCategoreIds.length) {
      getMaybeLikeList(curCategoreIds);
    }
  }, [pageNumber, getMaybeLikeList, curCategoreIds]);

  return (
    <div className="page model-detail">
      <div className="detail_left">
        <div className="model_wrap">
          <ModelView
            modelData={modelData}
            loadingText={`${t("model.loading")}`}
            type="detail"
          />
        </div>
        {type === "collection" && (
          <div className="collection-list">
            {collectionList.map((v) => {
              return (
                <img
                  src={v.figure}
                  key={v.id}
                  alt=""
                  className={`collection-item ${
                    v.id === modelData.id && "active-item"
                  }`}
                  onClick={() => setModelData(v)}
                />
              );
            })}
          </div>
        )}
        <div className="model-desc">
          <div className="desc_top">
            <p className="model-name">{modelData.name}</p>
            <div className="top-right">
              <div className="tag_wrap">
                <div className="tag-item">
                  <i className="iconfont icon-view"></i>
                  <span className="num">{modelData.view_num || 0}</span>
                </div>
                <div className="tag-item like">
                  <i className="iconfont icon-like"></i>
                  <span className="num">{modelData.like_num || 0}</span>
                </div>
              </div>
              <button className="get_btn">
                <i
                  className={`iconfont ${
                    modelData.get_type === 1 ? "icon-add" : "icon-car"
                  }`}
                ></i>
                <span className="price">
                  {modelData.get_type === 1
                    ? t("model.modelCard.free")
                    : modelData.pay_num}
                </span>
              </button>
            </div>
          </div>
          <div className="model-tag">
            {modelData.category?.map((v: any) => {
              return (
                <span className="tag" key={v.id}>
                  #{v.chinese_name}
                </span>
              );
            })}
          </div>
        </div>
        <div className="user-desc">
          <img src={modelData.user_head_img} alt="" className="header-img" />
          <span className="user-name">{modelData.user_name || "未命名"}</span>
          <button className="focus-btn">
            <i className="iconfont icon-add-user"></i>
            <span className="focus-text">{t("user.focus")}</span>
          </button>
        </div>
        <div className="model-desc_detail">
          {renderKeys.map((item) => {
            return (
              <div className="detail-item" key={item.key}>
                <p className="item-label">
                  <i className={`iconfont ${item.icon}`}></i>
                  <span className="label-name">{item.label}</span>
                </p>
                <div className="item-desc">
                  {item.render
                    ? item.render(modelData[item.key])
                    : modelData[item.key]}
                </div>
              </div>
            );
          })}
        </div>
        <div className="comment_wrap">
          <p className="comment_title">{t("model.comment.title")}</p>
          <div className="comment_main">
            <img src="" className="header-img" alt="" />
            <TextArea
              placeholder={`${t("model.comment.placeholder")}`}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </div>
        </div>
      </div>
      <div className="detail_right">
        <p className="title">{t("model.maybeLike")}</p>
        <div className="like_content">
          <div className="maybe-like_list">
            {maybeLikeList.map((v: any) => {
              return (
                <div className="like-card_wrap" key={v.id}>
                  <ModelCard data={v} type="detail" />
                </div>
              );
            })}
          </div>
          <div className="btn_wrap">
            <button
              className="load-more_btn"
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              {t("model.loadMore")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
