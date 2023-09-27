import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, Radio, Space, message } from "antd";
import UModelCheckbox from "../../form/UModelCheckbox";
import {
  getModelList,
  addModelCollection,
  updateModelCollection,
  getModelCollectionList,
  delModelCollection,
} from "@/api/model";
import "./collectionOperate.scss";
import "../index.scss";
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

interface CollectionOperatePropsI {
  title: string;
  editData?: any;
  type: "add" | "edit";
  userId: string;
  onClose: Function;
  onSuccess: Function;
}
const CollectionOperate: FC<CollectionOperatePropsI> = (props) => {
  const { title, type, onSuccess, onClose, userId, editData } = props;
  const { t } = useTranslation();

  const [collectionId, setCollectionId] = useState("");
  const [name, setName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [pageNum, setPageNum] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [modelList, setModelList] = useState<Array<any>>([]);
  const getMySingleModelList = useCallback(async () => {
    const res = await getModelList({
      user_id: userId,
      page_size: 30,
      page_number: pageNum,
      name: searchName,
      if_collection: 0,
      order_by_type: 0,
      list_type: 1,
    });
    if (res.errcode === 0) {
      setModelList((pre) => [...pre, ...res.data.list]);
    } else {
      message.error(res.msg);
    }
  }, [searchName, pageNum, userId]);

  const [selectModelList, setSelectModelList] = useState<any>([]);
  // 编辑的时候获取selectModelList
  const getSelectModelList = useCallback(async () => {
    const res = await getModelCollectionList({
      model_list_id: editData.id,
    });
    if (res.errcode === 0) {
      setSelectModelList(res.data);
    } else {
      message.error(res.msg);
    }
  }, [editData]);

  const resetForm = () => {
    setSelectModelList([]);
    setOperateStep(0);
    setName("");
    setPermissionType(1);
    setPrice(0);
  };

  useEffect(() => {
    if (type === "add") {
      resetForm();
      getMySingleModelList();
    } else {
      setOperateStep(1);
      getSelectModelList();
      if (editData) {
        const { id, name, get_type, pay_num } = editData;
        setCollectionId(id);
        setName(name);
        setPermissionType(get_type);
        setPrice(pay_num);
      }
    }
  }, [type, getSelectModelList, getMySingleModelList, editData]);

  const selectModel = (e: any) => {
    setSelectModelList(e);
  };

  const [operateStep, setOperateStep] = useState(0);
  const goNextStep = () => {
    if (selectModelList.length === 0) {
      message.info(t("message.noSelect"));
      return;
    }
    setOperateStep(1);
  };

  // 合集信息
  const permissionOptions = [
    {
      label: t("model.operate.upload.form.permissionsLabels.public"),
      value: 1,
    },
    {
      label: t("model.operate.upload.form.permissionsLabels.toll"),
      value: 2,
    },
    {
      label: t("model.operate.upload.form.permissionsLabels.private"),
      value: 4,
    },
  ];
  const [permissionType, setPermissionType] = useState(1);
  const [price, setPrice] = useState(0);
  const permissionDescs = [
    {
      key: "public",
      len: 4,
    },
    {
      key: "toll",
      len: 4,
    },
    {
      key: "private",
      len: 3,
    },
  ];

  const apiMap = {
    add: addModelCollection,
    edit: updateModelCollection,
  };
  const submit = async (type: "add" | "edit") => {
    const params: any = {
      name,
      get_type: permissionType,
      pay_num: price,
      model_list: selectModelList.map((v: any) => v.id),
      if_collection: 1,
      source: 2,
    };
    if (type === "edit") {
      params['id'] = collectionId;
    }
    const res = await apiMap[type](params);
    if (res.errcode === 0) {
      message.success("success");
      onSuccess();
    } else {
      message.error(res.msg);
    }
  };

  const delCollection = async () => {
    const res = await delModelCollection({
      id: editData.id,
    });
    if (res.errcode === 0) {
      message.success("success");
      onSuccess();
    } else {
      message.error(res.msg);
    }
  };

  return (
    <div className="collection-operate_wrap">
      <div className="operate-header">
        <p className="title">{title}</p>
        {type === "add" && (
          <div className="input_wrap operate-search_input">
            <i className="iconfont icon-find"></i>
            <input
              value={searchName}
              type="text"
              placeholder={`${t("header.search")}`}
              className="search-input"
              onChange={(e: any) => setSearchName(e.target.value)}
              onKeyDown={(e: any) => {
                if (e.keyCode === 13) {
                  setModelList([]);
                  setPageNum(0);
                  setHasMore(true);
                  getMySingleModelList();
                }
              }}
            />
          </div>
        )}
      </div>
      <div className="operate-body">
        <div className="operate-body_left">
          {type === "add" && (
            <div className="left-title">
              <span>{t("model.operate.upload.selected")}</span>
              <span>（{selectModelList.length}）</span>
            </div>
          )}
          <div className="select-list">
            {selectModelList.map((v: any) => {
              return (
                <div className="select-model_item" key={v.id}>
                  <div className="img_wrap">
                    <img src={v.figure} className="left-img" alt="" />
                  </div>
                  <div className="item_right">
                    <span className="model-name">{v.name}</span>
                    {v.get_type === 1 ? (
                      <span className="price">{t("model.modelCard.free")}</span>
                    ) : (
                      <span className="price">
                        <i className="iconfont icon-money3"></i>
                        {v.pay_num}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="operate-body_right">
          {operateStep === 0 ? (
            <CheckboxGroup onChange={selectModel}>
              <div className="checkbox-list">
                {modelList.map((v: any) => {
                  return (
                    <div className="checkbox_wrap" key={v.id}>
                      <UModelCheckbox data={v} />
                    </div>
                  );
                })}
              </div>
            </CheckboxGroup>
          ) : (
            <div className="next-form_wrap">
              <div className="form-left form-part">
                <div className="form-item item-single">
                  <span className="form-label label-require">
                    {t("model.operate.upload.form.name")}
                  </span>
                  <input
                    type="text"
                    className="common-input"
                    value={name}
                    placeholder={`${t(
                      "model.operate.upload.form.placeholders.name"
                    )}`}
                    onChange={(e: any) => setName(e.target.value)}
                  />
                </div>
                <div className="form-item item-single">
                  <span className="form-label label-require">
                    {t("model.operate.upload.form.permissions")}
                  </span>
                  <RadioGroup
                    className="permission-radio_group"
                    onChange={(e) => setPermissionType(e.target.value)}
                    value={permissionType}
                  >
                    <Space direction="vertical">
                      {permissionOptions.map((v: any) => {
                        return (
                          <Radio value={v.value} key={v.value}>
                            {v.label}
                          </Radio>
                        );
                      })}
                    </Space>
                  </RadioGroup>
                </div>
                {permissionType === 2 && (
                  <div className="form-item item-single">
                    <span className="form-label label-require">
                      {t("model.operate.upload.form.price")}
                    </span>
                    <div className="price-input_wrap common-input">
                      <i className="iconfont icon-money"></i>
                      <input
                        type="number"
                        className="price-input"
                        value={price}
                        placeholder={`${t(
                          "model.operate.upload.form.placeholders.price"
                        )}`}
                        onChange={(e: any) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="form-right form-part">
                <div className="form-item item-single">
                  <span className="form-label">
                    {t("model.operate.upload.form.collectionIllustrate.title")}
                  </span>
                  <ul className="desc-content">
                    {new Array(3).fill("").map((_, index) => {
                      return (
                        <li className="desc-line" key={index}>
                          {t(
                            `model.operate.upload.form.collectionIllustrate.desc.${index}`
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="form-item item-single">
                  <span className="form-label">
                    {t("model.operate.upload.form.permissionsDescTitle")}
                  </span>
                  <div className="permission-desc_wrap">
                    {permissionDescs.map((v: any, index: number) => {
                      return (
                        <div className="desc-item" key={index}>
                          <p className="desc-title">
                            {t(
                              `model.operate.upload.form.collectionPermissionsDesc.${v.key}.title`
                            )}
                          </p>
                          <ul className="desc-content">
                            {new Array(v.len)
                              .fill("")
                              .map((_, index2: number) => {
                                return (
                                  <li className="desc-line" key={index2}>
                                    {t(
                                      `model.operate.upload.form.collectionPermissionsDesc.${v.key}.desc.${index2}`
                                    )}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="operate-footer">
        {type === "add" ? (
          <div className="action-inner">
            {operateStep === 0 ? (
              <button
                className="footer-btn cancel-btn"
                onClick={() => onClose()}
              >
                {t("model.operate.upload.form.buttons.cancel")}
              </button>
            ) : (
              <button className="footer-btn cancel-btn">
                {t("model.operate.upload.form.buttons.pre")}
              </button>
            )}
            <div className="btn-right_wrap">
              {operateStep === 0 ? (
                <button className="footer-btn ok-btn" onClick={goNextStep}>
                  {t("model.operate.upload.form.buttons.next")}
                </button>
              ) : (
                <button
                  className="footer-btn ok-btn"
                  onClick={() => submit("add")}
                >
                  {t("model.operate.upload.form.buttons.create")}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="action-inner">
            <button className="footer-btn cancel-btn" onClick={() => onClose()}>
              {t("model.operate.upload.form.buttons.cancel")}
            </button>
            <div className="btn-right_wrap">
              <button
                className="footer-btn cancel-btn"
                onClick={() => delCollection()}
              >
                {t("model.operate.upload.form.buttons.delCollection")}
              </button>
              <button
                className="footer-btn ok-btn"
                onClick={() => submit("edit")}
              >
                {t("model.operate.upload.form.buttons.submit")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionOperate;
