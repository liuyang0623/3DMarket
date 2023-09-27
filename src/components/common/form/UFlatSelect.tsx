import { FC, useState, useEffect } from "react";
import "./index.scss";

interface UFlatSelectPropsI {
  options: Array<any>;
  onSelect: Function;
  value: string | number;
}
const UFlatSelect: FC<UFlatSelectPropsI> = (props) => {
  const { options, onSelect, value } = props;

  const [showMore, setShowMore] = useState(false);
  const [visibelOptions, setVisibelOptions] = useState(options.slice(0, 9));
  useEffect(() => {
    if (showMore) {
      setVisibelOptions(options);
    } else {
      setVisibelOptions(options.slice(0, 9));
    }
  }, [showMore, options]);
  return (
    <div className="uflat-selct">
      <div className="options_wrap">
        {visibelOptions.map((v) => {
          return (
            <button
              className={`option-item ${v.value === value ? "active-item" : "inactive-item"}`}
              key={v.value}
              onClick={() => onSelect(v.value)}
            >
              {v.label}
            </button>
          );
        })}
      </div>
      {options.length > 9 && (
        <button
          className={`more-btn ${showMore && "close-more_btn"}`}
          onClick={() => setShowMore(!showMore)}
        >
          <i className="iconfont icon-more"></i>
        </button>
      )}
    </div>
  );
};

export default UFlatSelect;
