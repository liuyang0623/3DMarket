import { FC, useState } from "react";
import { Slider } from "antd";
import { useTranslation } from "react-i18next";

interface USliderPropsI {
  defaultValue?: [number, number];
  disabled?: boolean;
  max: number;
  min: number;
  onSliderChange: Function;
}
const USlider: FC<USliderPropsI> = (props) => {
  const { max, min, defaultValue, onSliderChange } = props;
  const { t } = useTranslation();
  const [targetValue, setTargetValue] = useState<[number, number]>(
    defaultValue || [min, max]
  );
  const changeValue = (e: [number, number]) => {
    setTargetValue(e);
    onSliderChange(e);
  };
  return (
    <div className="u-slider_wrap">
      <div className="value_wrap">
        {targetValue[0] === 0 && targetValue[1] === max ? (
          <div className="text no-limit">
            <span>{t("filter.filter.price.noLimit")}</span>
          </div>
        ) : (
          <div className="text has-value">
            <span>${targetValue[0]}</span>
            <span>${targetValue[1]}</span>
          </div>
        )}
      </div>
      <Slider
        className="u-slider"
        max={max}
        min={min}
        range
        defaultValue={defaultValue}
        tooltip={{ open: false }}
        onAfterChange={(e: any) => changeValue(e)}
      />
    </div>
  );
};

export default USlider;
