import { FC, useRef } from "react";
import { Modal, message } from "antd";
import { useTranslation } from "react-i18next";
import { dataURLtoBlob } from "@/utils/common";
import { uploadFile } from "@/api/sys";
import "@google/model-viewer";
import "./modelShotModal.scss";

interface ModelShotModalPropsI {
  title: string;
  isOpen: boolean;
  modelSrc: string;
  onCancel: Function;
  onSuccess: Function;
}
const ModelShotModal: FC<ModelShotModalPropsI> = (props) => {
  const { title, isOpen, modelSrc, onCancel, onSuccess } = props;
  const { t } = useTranslation();
  const modelRef = useRef<any>(null);
  const shotPhoto = async () => {
    const base64 = await modelRef.current?.toDataURL();
    const blob = dataURLtoBlob(base64);
    const formData = new FormData();
    formData.append("file", blob, 'shot.png');
    const res = await uploadFile(formData);
    if (res.errcode === 0) {
        onSuccess(res.data.url)
    } else {
      message.error(res.msg);
    }
  };

  return (
    <Modal
      wrapClassName="model_shot-modal"
      onCancel={() => onCancel()}
      open={isOpen}
      closable={false}
      footer={false}
      width={500}
      maskClosable={false}
    >
      <div className="model-content">
        <p className="title">{title}</p>
        <div className="model-viewer_wrap">
          <model-viewer
            class="shot-model-view"
            ref={modelRef}
            src={modelSrc}
            // camera-orbit="180deg 90deg 20m"
            camera-orbit="180deg 90deg 20m"
            max-field-of-view="80deg"
            min-field-of-view="40deg"
            max-camera-orbit="auto 100deg auto"
            interaction-prompt="none"
            camera-controls=""
            orientation="0deg 0deg 145deg"
            autoplay
            shadow-intensity="3"
            exposure=".4"
            ar-status="not-presenting"
          />
        </div>
        <div className="footer-btn_wrap">
          <button className="footer-btn" onClick={() => onCancel()}>
            {t("model.operate.upload.form.buttons.cancel")}
          </button>
          <button className="footer-btn ok-btn" onClick={() => shotPhoto()}>
            {t("model.operate.upload.form.buttons.shot")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModelShotModal;
