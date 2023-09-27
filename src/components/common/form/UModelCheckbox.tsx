import { FC } from "react";
import { Checkbox, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

interface UModelCheckboxPropsI {
  data: any;
}

const UModelCheckbox: FC<UModelCheckboxPropsI> = (props) => {
  const { data } = props;
  const { id, figure, model_function_list, get_type, pay_num, name } = data;
  const { t } = useTranslation();
  return (
    <Checkbox className="card-checkbox" value={data}>
      <div className="model-checkbox_wrap">
        <div
          className="checkbox_top"
          style={{ backgroundImage: `url(${figure})` }}
        >
          {model_function_list?.length && (
            <Tooltip placement="top" title={`${t("model.modelCard.ani")}`}>
              <i className="iconfont icon-ani check-ani"></i>
            </Tooltip>
          )}
          <div className="price_wrap">
            <i className="iconfont icon-money"></i>
            <span className="price">
              {get_type === 1 ? t("model.modelCard.free") : pay_num}
            </span>
          </div>
        </div>
        <div className="checkbox_bottom">
          <p className="model-name">{name}</p>
        </div>
      </div>
    </Checkbox>
  );
};

export default UModelCheckbox;
