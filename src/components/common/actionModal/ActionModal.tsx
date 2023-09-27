import { FC } from "react";
import { Modal } from "antd";
import './actionModal.scss';

interface ActionModalPropsI {
  isOpen: boolean;
  title: string;
  desc: string;
  okText: string;
  cancelText: string;
  onOk: Function;
  onCancel: Function;
}

const ActionModal: FC<ActionModalPropsI> = (props) => {
  const { isOpen, title, desc, okText, cancelText, onOk, onCancel } = props;
  return (
    <Modal
      wrapClassName="action_modal"
      onCancel={() => onCancel()}
      open={isOpen}
      closable={false}
      footer={false}
      width={396}
      maskClosable={false}
    >
      <div className="action-modal_content">
        <p className="model-title">{title}</p>
        <p className="model-desc">{desc}</p>
        <div className="footer-btn_wrap">
          <button className="action-model_btn ok-btn">{cancelText}</button>
          <button className="action-model_btn">{okText}</button>
        </div>
      </div>
    </Modal>
  );
};

export default ActionModal;
