import { FC, useState } from "react";
import { getCountryList } from "@/utils/common";
import "./phonePrefix.scss";

interface PhonePrefixPropsInterface {
  selectCode: Function;
}
const PhonePrefix: FC<PhonePrefixPropsInterface> = (props) => {
  const { selectCode } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [activeCode, setActiveCode] = useState("+86");
  const phonePrefixData = getCountryList();

  const changeCode = (code: string) => {
    setActiveCode(code);
    selectCode(code);
    setIsOpen(false);
  };
 
  return (
    <div className="comp-wrap">
      <button className="show-code" onClick={() => setIsOpen(!isOpen)}>
        <span className="pre-value">{activeCode}</span>
      </button>
      {isOpen && <div className="prefix_mask" onClick={() => setIsOpen(false)}></div>}
      {isOpen && (
        <div className="select_wrap">
          <div className="select-item_wrap">
            {phonePrefixData.map((v) => {
              return (
                <div
                  className="select_item"
                  key={`${v.code}${v.city}`}
                  onClick={() => changeCode(v.code)}
                >
                  <span className="code">{v.code}</span>
                  <span className="city">{v.city}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhonePrefix;
