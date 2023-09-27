import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { addViewNum, changeLike } from "@/api/model";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/modules/shoppingCart";
import { loadImg } from "@/utils/dom";
import "./modelCard.scss";

interface ModelCardPropsI {
  data: any;
  type: "list" | "detail";
  onEdit?: Function;
}
const ModelCard: FC<ModelCardPropsI> = (props) => {
  const { type, onEdit, data } = props;
  const { t } = useTranslation();
  const { user_info } = useAppSelector((state) => state.user);
  const { shoppingCart } = useAppSelector((state) => state.shoppingCart);
  const dispatch = useAppDispatch();
  const [isAdded, setIsAdded] = useState(false);
  useEffect(() => {
    if (shoppingCart.length) {
      setIsAdded(shoppingCart.findIndex((v) => v.id === data.id) !== -1);
    }
  }, [shoppingCart, data]);
  const addCart = (e: any) => {
    e.stopPropagation();
    dispatch(addToCart({ good: data }));
  };
  const navigator = useNavigate();
  const [showConntent, setShowContent] = useState(false);
  const [modelData, setModelData] = useState(data);
  const {
    id,
    figure,
    if_collection,
    view_num,
    like_num,
    get_type,
    pay_num,
    user_head_img,
    model_function_list,
    name,
    user_name,
    if_like,
    user_id,
    url,
  } = modelData;
  const [isLoadPreviewImg, setIsLoadPreviewImg] = useState(false);
  const [cardPreviewImg, setCardPreviewImg] = useState(figure);
  const [backgroundPositionX, setBackgroundPositionX] = useState("0%");
  const [previewStyle, setPreviewStyle] = useState<any>({
    backgroundImage: `url(${cardPreviewImg})`,
    // backgroundPosition: `center`,
  });
  // preview图尺寸为5920 × 218，cardtop高度为170，换算backgroundSizeX为5920/(218/170)等于4616.514
  const loadPreviewImg = async () => {
    if (type === "detail" || !url || if_collection === 1) return;
    if (!isLoadPreviewImg) {
      const res: any = await loadImg(url);
      if (res.code === 200) {
        setIsLoadPreviewImg(true);
        setCardPreviewImg(url);
        setPreviewStyle({
          ...previewStyle,
          // backgroundPosition: `${backgroundPositionX}% center`,
          backgroundImage: `url(${url})`,
          backgroundSize: "4616.514px 170px",
          backgroundRepeat: "repeat-x",
        });
      } else {
        message.error(res.msg);
      }
    }
  };
  const [curClientX, setCurClientX] = useState(0);
  const [step, setStep] = useState(0);
  const previewModel = (e: any) => {
    if (type === "detail" || !url || !isLoadPreviewImg) return;
    if (curClientX === 0) {
      setCurClientX(e.clientX);
    } else {
      if (e.clientX - curClientX >= 306 / 15) {
        setCurClientX(e.clientX);
        setStep((pre) => {
          setBackgroundPositionX(`${(pre + 1) * (1 / 14) * 100}%`);
          return pre + 1;
        });
      }
      if (curClientX - e.clientX >= 306 / 15) {
        setCurClientX(e.clientX);
        setStep((pre) => {
          setBackgroundPositionX(`${(pre - 1) * (1 / 14) * 100}%`);
          return pre - 1;
        });
      }
    }
  };

  const viewModel = async () => {
    await addViewNum({ model_id: id });
    const type = if_collection === 1 ? 'collection' : 'model'
    navigator(`/detail/${type}/${id}`);
  };

  const switchLike = async (e: any) => {
    e.stopPropagation();
    const res = await changeLike({ model_id: id, opt: if_like === 1 ? 2 : 1 });
    if (res.errcode === 0) {
      setModelData({
        ...modelData,
        if_like: if_like === 1 ? 2 : 1,
        like_num: if_like === 1 ? like_num - 1 : like_num + 1,
      });
    }
  };
  const editModel = async (e: any) => {
    e.stopPropagation();
    console.log("eidt");
    onEdit && onEdit(modelData);
  };
  return (
    <div
      className={`model-card_wrap ${
        if_collection === 1 && `muti-card_wrap-${type}`
      } card-type_${type}`}
      onMouseEnter={() => setShowContent(true)}
      onMouseLeave={() => setShowContent(false)}
      onClick={viewModel}
    >
      <div
        className={`card-top ${
          url && if_collection === 0
            ? isLoadPreviewImg
              ? "--loaded --visible"
              : ""
            : ""
        }`}
        style={{
          ...previewStyle,
          backgroundPosition: `${
            backgroundPositionX === "0%" && !url
              ? "center"
              : `${backgroundPositionX}`
          } center`,
        }}
        onMouseEnter={loadPreviewImg}
        onMouseMove={previewModel}
      >
        {showConntent && (
          <div className="card-content">
            <div className="card-content_top">
              {model_function_list?.length && (
                <Tooltip placement="top" title={`${t("model.modelCard.ani")}`}>
                  <i className="iconfont icon-ani"></i>
                </Tooltip>
              )}
            </div>
            <div className="card-content_bottom">
              <div className="price_wrap">
                <i className="iconfont icon-money"></i>
                <span className="price">
                  {get_type === 1 ? t("model.modelCard.free") : pay_num}
                </span>
              </div>
              {user_id !== user_info.user_id ? (
                !isAdded ? (
                  <button className="cart_btn" onClick={addCart}>
                    <i className="iconfont icon-car"></i>
                  </button>
                ) : (
                  <div className="added-sign">
                    <i className="iconfont icon-add4"></i>
                  </div>
                )
              ) : (
                onEdit && (
                  <button className="cart_btn" onClick={editModel}>
                    <i className="iconfont icon-setting"></i>
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
      {if_collection === 1 && type === "list" ? (
        <div className="card-bottom_muti">
          <div className="card-bottom_muti-inner">
            <div className="card-bottom">
              <div className="bottom_left">
                {type === "list" && (
                  <img src={user_head_img} className="user-img" alt="" />
                )}
                <span className="model-name">{name}</span>
              </div>
              <div className="bottom_right">
                <div className="tag-item">
                  <i className="iconfont icon-view"></i>
                  <span className="num">{view_num || 0}</span>
                </div>
                <div
                  className={`tag-item like ${if_like === 1 && "liked"}`}
                  onClick={switchLike}
                >
                  <i className="iconfont icon-like"></i>
                  <span className="num">{like_num || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-bottom">
          <div className="bottom_left">
            {type === "list" && (
              <img src={user_head_img} className="user-img" alt="" />
            )}
            <span className="model-name">{name}</span>
            {type === "detail" && (
              <span className="user-name">{user_name || "未知"}</span>
            )}
          </div>
          <div className="bottom_right">
            <div className="tag-item">
              <i className="iconfont icon-view"></i>
              <span className="num">{view_num || 0}</span>
            </div>
            <div
              className={`tag-item like ${if_like === 1 && "liked"}`}
              onClick={switchLike}
            >
              <i className="iconfont icon-like"></i>
              <span className="num">{like_num || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelCard;
