import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatNum } from "@/utils/common";
import USelect from "../form/USelect";
import "./userCenterFilter.scss";

interface UserCenterFilterPropsI {
  options: Array<any>;
  activeIndex?: number;
  onChange: Function;
}
const UserCenterFilter: FC<UserCenterFilterPropsI> = (props) => {
  const { options, onChange } = props;
  const { t } = useTranslation();
  const [listType, setListType] = useState<any>([options[0].key]);
  const [sortType, setSortType] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const changeModelType = (key: string, index: number) => {
    setActiveTabIndex(index);
    setListType(key);
    onChange({
      listType: key,
      filterType: sortType,
    });
  };

  const changeSortType = (val: any) => {
    setSortType(val);
    onChange({
      listType,
      filterType: val,
    });
  };

  return (
    <div className="user-center-filter_wrap">
      <div className="filter-left">
        {options.map((v, index) => {
          return (
            <button
              className={`filter-btn ${
                activeTabIndex === index && "tab-active"
              }`}
              key={v.key}
              onClick={() => changeModelType(v.key, index)}
            >
              <span className="text btn-text">{v.btnText}</span>
              {v.num > 0 && (
                <span className="text value">{formatNum(v.num)}</span>
              )}
            </button>
          );
        })}
      </div>
      <USelect
        prefixIcon="icon-sort"
        options={[
          {
            label: `${t("filter.sort.comprehensive")}`,
            value: 0,
          },
          {
            label: `${t("filter.sort.mostget")}`,
            value: 1,
          },
          {
            label: `${t("filter.sort.mostlike")}`,
            value: 2,
          },
          {
            label: `${t("filter.sort.mostview")}`,
            value: 3,
          },
          {
            label: `${t("filter.sort.latestupload")}`,
            value: 4,
          },
          {
            label: `${t("filter.sort.originupload")}`,
            value: 5,
          },
          {
            label: `${t("filter.sort.priceAsc")}`,
            value: 6,
          },
          {
            label: `${t("filter.sort.priceDesc")}`,
            value: 7,
          },
        ]}
        onSelect={(e: any) => changeSortType(e)}
        value={sortType}
      />
    </div>
  );
};

export default UserCenterFilter;
