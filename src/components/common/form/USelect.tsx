import { FC, useState } from "react";
import "./index.scss";

interface USelectPropsI {
  prefixIcon?: string;
  suffixIcon?: string;
  options: Array<any>;
  onSelect: Function;
  value: string | number;
}
const USelect: FC<USelectPropsI> = (props) => {
  const [showOptions, setShowOptions] = useState(false);
  const { prefixIcon, options, value, onSelect, suffixIcon } = props;
  const label = options.find((v) => v.value === value).label;

  const selectSort = (e: any) => {
    setShowOptions(false);
    onSelect(e);
  }
  return (
    <div className={`uselect_wrap ${prefixIcon && 'pre-type'} ${suffixIcon && 'suf-type'}`}>
      <div className="select-main" onClick={() => setShowOptions(!showOptions)}>
        <i className={`iconfont ${prefixIcon}`}></i>
        <span className="label">{label}</span>
      </div>
      {showOptions && <div className="select-mask" onClick={() => setShowOptions(false)}></div>}
      {showOptions && (
        <ul className="option_wrap">
          {options.map((v: any) => {
            return (
              <li
                className={`option-item ${v.value === value && 'active-option'}`}
                key={v.value}
                onClick={() => selectSort(v.value)}
              >
                {v.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default USelect;
