import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

interface ULabelAreaPropsI {
  data: Array<any>;
  onChange: Function;
  removeLabel: Function;
}

const ULabelArea: FC<ULabelAreaPropsI> = (props) => {
  const { data, onChange, removeLabel } = props;
  const { t } = useTranslation();
  const [labelText, setLabelText] = useState("");

  const pushLabel = (e: any) => {
    if (!e.target.value) return;
    if (e.keyCode === 13) {
      if (data.includes(e.target.value)) {
        setLabelText("");
        return;
      }
      onChange(e.target.value);
      setLabelText("");
    }
  };
  return (
    <div className="label_wrap">
      {data.map((v, index) => {
        return (
          <div
            className="label-item_wrap"
            key={v}
            onClick={() => removeLabel(index)}
          >
            <span className="label-text">{v}</span>
            <i className="iconfont icon-close"></i>
          </div>
        );
      })}
      <input
        value={labelText}
        type="text"
        className="push-label_input"
        placeholder={`${t("model.operate.upload.form.placeholders.label")}`}
        onChange={(e) => setLabelText(e.target.value)}
        onKeyDown={(e: any) => pushLabel(e)}
      />
    </div>
  );
};

export default ULabelArea;
