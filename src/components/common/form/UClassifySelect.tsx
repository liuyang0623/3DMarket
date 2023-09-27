import { FC, useState, useEffect } from "react";
import { message, Select } from "antd";
import { useTranslation } from "react-i18next";
import { getModelCategory } from "@/api/model";

interface UClassifySelectPropsI {
  category1: string | number | undefined;
  category2: string | number | undefined;
  getCategory1: Function;
  getCategory2: Function;
}
const UClassifySelect: FC<UClassifySelectPropsI> = (props) => {
  const { category1, category2, getCategory1, getCategory2 } = props;
  const { t } = useTranslation();
  const [classify1, setClassify1] = useState(category1);
  const [classify1Options, setClassify1Options] = useState([]);
  const [classify2, setClassify2] = useState(category2);
  const [classify2Options, setClassify2Options] = useState([]);

  const getModelClassify = async (pid: number | string, cb: Function) => {
    const res = await getModelCategory({ pid });
    if (res.errcode === 0) {
      cb(res.data);
    } else {
      message.error(res.msg);
    }
  };

  useEffect(() => {
    getModelClassify(0, setClassify1Options);
  }, []);

  useEffect(() => {
    if (classify1) {
      getModelClassify(classify1, setClassify2Options);
    }
  }, [classify1]);

  return (
    <div className="classify-select_wrap">
      <Select
        className="common-select"
        placeholder={`${t("model.operate.upload.form.placeholders.classify1")}`}
        value={classify1}
        options={classify1Options.map((v: any) => ({
          value: v.id,
          label: v.chinese_name,
        }))}
        onChange={(e) => {
          setClassify1(e);
          getCategory1(e);
        }}
      />
      <Select
        placeholder={`${t("model.operate.upload.form.placeholders.classify2")}`}
        className="common-select"
        value={classify2}
        options={classify2Options.map((v: any) => ({
          value: v.id,
          label: v.chinese_name,
        }))}
        onChange={(e) => {
          setClassify2(e);
          getCategory2(e);
        }}
      />
    </div>
  );
};
export default UClassifySelect;
