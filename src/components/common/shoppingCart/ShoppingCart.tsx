import { FC, ReactNode } from "react";
import { Popover } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeFromCart } from "@/store/modules/shoppingCart";
import { useTranslation } from "react-i18next";
import { addViewNum } from "@/api/model";
import "./shoppingCart.scss";

interface ShoppingCartPropsI {
  innerBtn: ReactNode;
  isOpen: boolean;
  onClose: Function;
}

const ShoppingCart: FC<ShoppingCartPropsI> = (props) => {
  const { innerBtn, isOpen, onClose } = props;
  return (
    <Popover
      className="shopping-cart_pop"
      trigger="click"
      open={isOpen}
      content={<PopoverContent />}
      onOpenChange={(e) => onClose(e)}
    >
      {innerBtn}
    </Popover>
  );
};

const PopoverContent: FC = () => {
  const { t } = useTranslation();
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const { shoppingCart } = useAppSelector((state) => state.shoppingCart);
  const goModelDetail = async (data: any) => {
    await addViewNum({ model_id: data.id });
    const type = data.if_collection === 1 ? "collection" : "model";
    navigator(`/detail/${type}/${data.id}`);
  };
  return (
    <div className="shopping-cart_content">
      <p className="cart-title">{t("shoppingCart.title")}</p>
      {shoppingCart.length > 0 ? (
        <div className="cart-list">
          {shoppingCart.map((v) => {
            return (
              <div
                className="cart-item"
                key={v.id}
                onClick={() => goModelDetail(v)}
              >
                <img src={v.figure} className="left_img" alt="" />
                <div className="cart-item_right">
                  <div className="right-left">
                    <div className="left-top">
                      <p className="model-name">{v.name}</p>
                      <p className="user-name">{v.user_name || "未知"}</p>
                    </div>
                    <div className="price_wrap">
                      {v.get_type === 0 ? (
                        <span>{t("model.modelCard.free")}</span>
                      ) : (
                        <span>
                          <i className="iconfont icon-money3"></i>
                          {v.pay_num}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="remove_btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFromCart({ id: v.id }));
                    }}
                  >
                    <i className="iconfont icon-del"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="cart-list">空的</div>
      )}
      {shoppingCart.length > 0 && (
        <div className="check_wrap">
          <button className="check_btn">
            <i className="iconfont icon-car"></i>
            <span>
              {t("shoppingCart.check")}（{shoppingCart.length}）
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
