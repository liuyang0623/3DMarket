import { FC, ReactNode } from "react";
import { Modal } from "antd";
import "./uploadModal.scss";

interface UploadModalPropsI {
  isOpen: boolean;
  onClose: Function;
  modalInner: ReactNode;
}
const UploadModal: FC<UploadModalPropsI> = (props) => {
  const { isOpen, onClose, modalInner } = props;

  const closeModal = () => {
    onClose();
  };

  return (
    <Modal
      wrapClassName="model-operate_modal"
      onCancel={closeModal}
      open={isOpen}
      closable={false}
      footer={false}
      width={"90%"}
      maskClosable={false}
    >
      {modalInner}
    </Modal>
  );
};

export default UploadModal;
