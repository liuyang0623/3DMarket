import { FC, useEffect } from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import { captchaInit } from "@/utils/tools";
import "./captcha.scss";

interface CaptchaPropsI {
  isOpen: boolean;
  onClose: Function;
  captchaSuccess: Function;
}
const Captcha: FC<CaptchaPropsI> = (props) => {
  const { isOpen, onClose, captchaSuccess } = props;
  const { t, i18n } = useTranslation();

  const closeCaptcha = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      if (!window.nc) {
        captchaInit("#captcha", i18n.language, (data: any) => {
          captchaSuccess(data);
        });
      } else {
        window.nc.reset();
      }
    }
  }, [isOpen, captchaSuccess, i18n]);

  return (
    <Modal
      wrapClassName="captcha-modal"
      onCancel={closeCaptcha}
      open={isOpen}
      closable={false}
      footer={false}
      width={320}
    >
      <div className="modal-content">
        <p className="captcha_title">{t("login.captcha")}</p>
        <div id="captcha"></div>
      </div>
    </Modal>
  );
};

export default Captcha;
