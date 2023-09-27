import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Spin, message, Radio, Space } from "antd";
import ModelView from "../../modelView/ModelView";
import UClassifySelect from "../../form/UClassifySelect";
import ULabelArea from "../../form/ULabelArea";
import UAnimationForm from "../../form/UAnimationForm";
import ModelShotModal from "../modelShotModal/ModelShotModal";
import ActionModal from "../../actionModal/ActionModal";
import { uploadFile } from "@/api/sys";
import { addSingleModel, updateSingleModel, delModel } from "@/api/model";
import { getFileSize, deepClone } from "@/utils/common";
import { useAppDispatch } from "@/store/hooks";
import { setGlobalLoading } from "@/store/modules/utils";
import "./modelOperate.scss";
import "../index.scss";
const { Dragger } = Upload;
const RadioGroup = Radio.Group;

interface ModelOperatePropsI {
  type: "edit" | "add";
  title: string;
  modelData?: any;
  onClose: Function;
  onSuccess: Function;
}
const ModelOperate: FC<ModelOperatePropsI> = (props) => {
  const { type, title, onClose, onSuccess, modelData } = props;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // 提示弹窗
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionModalTitle, setActionModalTitle] = useState<any>(
    t("action.draft.title")
  );
  const [actionModalDesc, setActionModalDesc] = useState<any>(
    t("action.draft.desc")
  );
  const [actionModalOkText, setActionModalOkText] = useState<any>(
    t("action.draft.okText")
  );
  const [actionModalCancelText, setActionModalCancelText] = useState<any>(
    t("action.draft.cancelText")
  );

  const [showLoading, setShowLoading] = useState(false);
  const [modelFile, setModelFile] = useState("");
  const [fileSize, setFileSize] = useState("未知");
  const [fileSizeShow, setFileSizeShow] = useState("未知");
  const uploadGlb = async (file: any) => {
    setFileSize(file.size);
    setFileSizeShow(getFileSize(file.size));
    setShowLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadFile(formData);
    setShowLoading(false);
    if (res.errcode === 0) {
      setModelFile(res.data.url);
    } else {
      message.error(res.msg);
    }
    return false;
  };

  const [isAdd, setIsAdd] = useState(true);
  const [singlePic, setSinglePic] = useState("");
  const [previewImg, setPreviewImg] = useState("");

  const [modelId, setModelId] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category1, setCategory1] = useState(undefined);
  const [category2, setCategory2] = useState(undefined);

  const [labels, setLabels] = useState<Array<string>>([]);
  const [aniList, setAniList] = useState<Array<any>>([]);

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
  const [price, setPrice] = useState(0);

  // 重新截模型图片
  const [showShotModal, setShowShotModal] = useState(false);

  // 新增单个模型
  const submitApi: any = {
    add: addSingleModel,
    edit: updateSingleModel,
  };
  const submitModel = async (type: string) => {
    const params: any = {
      name,
      describe: desc,
      size: fileSize,
      file: modelFile,
      figure: singlePic,
      url: previewImg,
      labels,
      get_type: permissionType,
      pay_num: price,
      model_function_list: aniList || [],
      category1: [category1, category2],
      source: 2,
    };
    if (type === "edit") {
      params["id"] = modelId;
    }
    dispatch(setGlobalLoading({ title: "上传中...", show: true }));
    const res = await submitApi[type](params);
    dispatch(setGlobalLoading({ title: "上传中...", show: false }));
    if (res.errcode === 0) {
      onSuccess();
    } else {
      message.error(res.msg);
    }
  };
  // 删除模型
  const deleteModel = async () => {
    const res = await delModel({ id: modelId });
    if (res.errcode === 0) {
      onSuccess();
      message.success('del')
    } else {
      message.error(res.msg);
    }
  }

  useEffect(() => {
    if (modelData) {
      const {
        id,
        name,
        file,
        figure,
        url,
        get_type,
        pay_num,
        size,
        functions,
        describe,
      } = modelData;
      setModelId(id);
      setName(name);
      setDesc(describe || '');
      setModelFile(file);
      setSinglePic(figure);
      setPreviewImg(url);
      const resLabels = modelData.labels.map((item: any) => item.name);
      setLabels(resLabels);
      setPermissionType(get_type);
      setAniList(functions);
      setPrice(pay_num);
      setFileSize(size);
      setFileSizeShow(getFileSize(size));
      setCategory1(modelData.category[0]?.id);
      setCategory2(modelData.category[1]?.id);
      setIsAdd(false);
    }
  }, [modelData]);
  return (
    <div className="model-operate_wrap">
      <div className="modal-title">{title}</div>
      <div className="operate-body">
        {modelFile ? (
          <div className="operate-main">
            <div className="body-left">
              <div className="model-show_wrap">
                <ModelView
                  modelData={{ file: modelFile }}
                  loadingText={`${t("model.operate.upload.check")}`}
                  type="operate"
                  size={fileSizeShow}
                  isAdd={isAdd}
                  getSingleImg={(img: string) => setSinglePic(img)}
                  getPreivewImg={(img: string) => setPreviewImg(img)}
                  getAniList={(list: any) => setAniList(list)}
                />
              </div>
              <Upload
                accept=".glb"
                maxCount={1}
                showUploadList={false}
                beforeUpload={(file) => uploadGlb(file)}
              >
                <button className="reupload_btn">
                  <i className="iconfont icon-upload3"></i>
                  <span>{t("model.operate.upload.reupload")}</span>
                </button>
              </Upload>
              <div className="model-illustrate">
                <p className="title">
                  {t("model.operate.upload.modelIllustrate.title")}
                </p>
                <ul className="desc_wrap">
                  {new Array(2).fill("").map((_, index) => {
                    return (
                      <li className="li-item" key={index}>
                        {t(
                          `model.operate.upload.modelIllustrate.desc.${index}`
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="body-middle">
              <div className="middle-top">
                <div className="top-left">
                  <div className="form-item">
                    <span className="form-label label-require">
                      {t("model.operate.upload.form.name")}
                    </span>
                    <input
                      value={name}
                      type="text"
                      className="common-input"
                      placeholder={`${t(
                        "model.operate.upload.form.placeholders.name"
                      )}`}
                      onChange={(e: any) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-item">
                    <span className="form-label label-require">
                      {t("model.operate.upload.form.classify")}
                    </span>
                    <UClassifySelect
                      category1={category1}
                      category2={category2}
                      getCategory1={(e: any) => setCategory1(e)}
                      getCategory2={(e: any) => setCategory2(e)}
                    />
                  </div>
                </div>
                <div className="form-item">
                  <span className="form-label">
                    {t("model.operate.upload.form.cover")}
                  </span>
                  <div
                    className="pic_wrap"
                    onClick={() => setShowShotModal(true)}
                  >
                    <img src={singlePic} alt="" className="model-pic" />
                  </div>
                </div>
              </div>
              <div className="form-item item-single">
                <span className="form-label">
                  {t("model.operate.upload.form.label")}
                </span>
                <ULabelArea
                  data={labels}
                  onChange={(e: string) => setLabels([...labels, e])}
                  removeLabel={(e: number) => {
                    const labelsTemp = labels;
                    labelsTemp.splice(e, 1);
                    setLabels(deepClone(labelsTemp));
                  }}
                />
              </div>
              <div className="form-item item-single">
                <span className="form-label">
                  {t("model.operate.upload.form.desc")}
                </span>
                <textarea
                  value={desc}
                  className="common-input common-textarea"
                  placeholder={`${t(
                    "model.operate.upload.form.placeholders.desc"
                  )}`}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              {aniList.length > 0 && (
                <div className="form-item item-single">
                  <span className="form-label label-require">
                    {t("model.operate.upload.form.animate")}
                  </span>
                  <UAnimationForm data={aniList} />
                </div>
              )}
            </div>
            <div className="body-right">
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
              <div className="form-item item-single">
                <span className="form-label label-require">
                  {t("model.operate.upload.form.permissionsDescTitle")}
                </span>
                <div className="permission-desc_wrap">
                  {permissionDescs.map((v: any, index: number) => {
                    return (
                      <div className="desc-item" key={index}>
                        <p className="desc-title">
                          {t(
                            `model.operate.upload.form.permissionsDesc.${v.key}.title`
                          )}
                        </p>
                        <ul className="desc-content">
                          {new Array(v.len)
                            .fill("")
                            .map((_, index2: number) => {
                              return (
                                <li className="desc-line" key={index2}>
                                  {t(
                                    `model.operate.upload.form.permissionsDesc.${v.key}.desc.${index2}`
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
        ) : (
          <Dragger
            className="upload-model"
            accept=".glb"
            maxCount={1}
            showUploadList={false}
            beforeUpload={(file) => uploadGlb(file)}
          >
            <Spin
              spinning={showLoading}
              tip={`${t("model.operate.upload.loading")}`}
              style={{ width: "100%", height: "100%" }}
            >
              <img
                src={require("../../../../assets/images/upload.png")}
                className="upload-logo"
                alt=""
              />
              <div className="upload_desc">
                <p className="add_wrap">
                  <span>{t("model.operate.upload.text")}</span>
                  <span className="add_btn">
                    {t("model.operate.upload.add")}
                  </span>
                </p>
                <p className="upload-tip">{t("model.operate.upload.tip")}</p>
              </div>
            </Spin>
          </Dragger>
        )}
      </div>
      <div className="operate-footer">
        {type === "add" ? (
          <div className="action-inner">
            <button className="footer-btn cancel-btn" onClick={() => onClose()}>
              {t("model.operate.upload.form.buttons.cancel")}
            </button>
            <div className="btn-right_wrap">
              <button className="footer-btn cancel-btn">
                {t("model.operate.upload.form.buttons.draft")}
              </button>
              <button
                className="footer-btn ok-btn"
                onClick={() => submitModel("add")}
              >
                {t("model.operate.upload.form.buttons.upload")}
              </button>
            </div>
          </div>
        ) : (
          <div className="action-inner">
            <button className="footer-btn cancel-btn" onClick={() => onClose()}>
              {t("model.operate.upload.form.buttons.cancel")}
            </button>
            <div className="btn-right_wrap">
              <button className="footer-btn warn-btn" onClick={deleteModel}>
                {t("model.operate.upload.form.buttons.delModel")}
              </button>
              <button
                className="footer-btn ok-btn"
                onClick={() => submitModel("edit")}
              >
                {t("model.operate.upload.form.buttons.submit")}
              </button>
            </div>
          </div>
        )}
      </div>
      <ModelShotModal
        isOpen={showShotModal}
        title={`${t("model.operate.upload.shotTitle")}`}
        onCancel={() => setShowShotModal(false)}
        modelSrc={modelFile}
        onSuccess={(url: string) => {
          setSinglePic(url);
          setShowShotModal(false);
        }}
      />
      <ActionModal
        isOpen={showActionModal}
        title={actionModalTitle}
        desc={actionModalDesc}
        okText={actionModalOkText}
        cancelText={actionModalCancelText}
        onOk={() => {}}
        onCancel={() => {}}
      />
    </div>
  );
};

export default ModelOperate;
