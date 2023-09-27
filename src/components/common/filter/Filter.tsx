import { FC, useEffect, useState } from "react";
import { Checkbox, message } from "antd";
import { useTranslation } from "react-i18next";
import USelect from "../form/USelect";
import UFlatSelect from "../form/UFlatSelect";
import USlider from "../form/USlider";
import { getModelCategory } from "@/api/model";
import "./filter.scss";

interface FilterPropsI {
  changeSortFilter: Function;
}
const Filter: FC<FilterPropsI> = (props) => {
  const { changeSortFilter } = props;

  const { t } = useTranslation();
  const [sortType, setSortType] = useState(0);
  const [modelTypeList, setModelTypeList] = useState<Array<any>>([]);
  const [modelType, setModelType] = useState("");
  const [showBottomFilter, setShowBottomFilter] = useState(false);
  const [time, setTime] = useState(0);
  const [isGroup, setIsGroup] = useState(false);
  const [hasAni, setHasAni] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [priceScope, setPriceScope] = useState<[number, number]>([0, 500]);

  const timeMap: any = [
    {
      label: t("filter.filter.time.all"),
      value: 0,
    },
    {
      label: t("filter.filter.time.month"),
      value: 1,
    },
    {
      label: t("filter.filter.time.week"),
      value: 2,
    },
    {
      label: t("filter.filter.time.today"),
      value: 3,
    },
  ];

  const getModelCategoryList = async () => {
    const res = await getModelCategory({ pid: 0 });
    if (res.errcode === 0) {
      if (!res.data.length) {
        message.error("一级分类为空");
        return;
      }
      res.data.forEach(async (v: any) => {
        const res = await getModelCategory({ pid: v.id });
        if (res.errcode === 0) {
          const categoryTemp: Array<any> = [];
          res.data.forEach((e: any) => {
            categoryTemp.push({
              label: e.chinese_name,
              value: e.id,
            });
          });
          setModelTypeList((pre) => [...pre, ...categoryTemp]);
        } else {
          message.error(res.msg);
        }
      });
    } else {
      message.error(res.msg);
    }
  };

  useEffect(() => {
    getModelCategoryList();
  }, []);

  useEffect(() => {
    const params: any = {
      min_price: priceScope[0],
      max_price: priceScope[1],
    };
    if (sortType) {
      params["order_by_type"] = sortType;
    }
    if (time) {
      params["time_type"] = time;
    }
    if (modelType) {
      params["category_id"] = modelType;
    }
    if (isGroup) {
      params["if_collection"] = 1;
    }
    if (hasAni) {
      params["if_function"] = 1;
    }
    if (isFree) {
      params["get_type"] = 1;
    }
    changeSortFilter(params);
  }, [sortType, modelType, time, isGroup, hasAni, isFree, priceScope, changeSortFilter]);

  return (
    <div className="filter_wrap">
      <div className="filter-top">
        <button
          className={`model-filter_btn ${showBottomFilter && "filter-active"}`}
          onClick={() => setShowBottomFilter(!showBottomFilter)}
        >
          <i className="iconfont icon-filter"></i>
          <span className="label">{t("filter.filter.btn")}</span>
        </button>
        <UFlatSelect
          options={modelTypeList}
          value={modelType}
          onSelect={(e: any) => setModelType(e)}
        />
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
          onSelect={(e: any) => setSortType(e)}
          value={sortType}
        />
      </div>
      {showBottomFilter && (
        <div className="filter-bottom">
          <USelect
            prefixIcon="icon-filter"
            options={timeMap}
            value={time}
            onSelect={(e: any) => setTime(e)}
          />
          <div className="checkbox_wrap">
            <Checkbox
              className="u-checkbox"
              checked={isGroup}
              onChange={(e: any) => setIsGroup(e.target.checked)}
            >
              {t("filter.filter.modelType.group")}
            </Checkbox>
            <Checkbox
              className="u-checkbox"
              checked={hasAni}
              onChange={(e: any) => setHasAni(e.target.checked)}
            >
              {t("filter.filter.modelType.animation")}
            </Checkbox>
            <Checkbox
              className="u-checkbox"
              checked={isFree}
              onChange={(e: any) => setIsFree(e.target.checked)}
            >
              {t("filter.filter.modelType.free")}
            </Checkbox>
          </div>
          <div className="slider_wrap">
            <USlider
              max={500}
              min={0}
              defaultValue={priceScope}
              onSliderChange={(e: any) => setPriceScope(e)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
