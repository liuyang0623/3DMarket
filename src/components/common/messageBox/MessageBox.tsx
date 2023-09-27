import { FC, ReactNode, useState } from "react";
import { Popover } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/common";
import "./messageBox.scss";

interface MessageBoxPropsI {
  innerBtn: ReactNode;
  message: Array<any>;
  isOpen: boolean;
  onClose: Function;
}

const MessageBox: FC<MessageBoxPropsI> = (props) => {
  const { innerBtn, isOpen, onClose, message } = props;
  return (
    <Popover
      className="message-box_pop"
      trigger="click"
      open={isOpen}
      content={<PopoverContent message={message} />}
      onOpenChange={(e) => onClose(e)}
    >
      {innerBtn}
    </Popover>
  );
};

interface PopoverContentPropsI {
  message: Array<any>;
}
const PopoverContent: FC<PopoverContentPropsI> = (props) => {
  const { message } = props;
  const { t } = useTranslation();
  const navigator = useNavigate();
  return (
    <div className="message-list_content">
      <p className="message-title">{t("messageBox.title")}</p>
      {message.length > 0 ? (
        <div className="message-list">
          {message.map((v) => {
            return (
              <div className="message-item" key={v.id}>
                <img
                  className="logo-img"
                  src={
                    v.type === 0
                      ? require("@/assets/images/msg-logo.png")
                      : v.user_info.header_img
                  }
                  alt=""
                />
                <div className="message-right">
                  <div className="top">
                    <p className="title">{v.title}</p>
                    <span className="time">{formatDate(v.time)}</span>
                  </div>
                  <p className="bottom">{v.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="message-list">空的</div>
      )}
      {message.length > 0 && (
        <div className="check_wrap">
          <button className="check_btn">
            <span>
              {t("messageBox.readAll")}（{message.length}）
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
