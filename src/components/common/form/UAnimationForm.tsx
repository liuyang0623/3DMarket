import { FC } from "react";
import { useTranslation } from "react-i18next";

interface UAnimationFormPropsI {
  data: Array<any>;
}
const UAnimationForm: FC<UAnimationFormPropsI> = (props) => {
  const { data } = props;
  const { t } = useTranslation();

  const changeAniForm = (data: any) => {};
  return (
    <div className="ani-form_wrap">
      <div className="form-head">
        <div className="head-item">
          {t("model.operate.upload.form.animateList")}
        </div>
        <div className="head-item">
          {t("model.operate.upload.form.animateName")}
        </div>
      </div>
      <div className="form-content">
        {data.map((v: any) => {
          return (
            <div className="form-col" key={v.name}>
              <div className="col-item">{v.animation}</div>
              <div className="col-item">
                <input
                  type="text"
                  value={v.name}
                  onChange={(v) => changeAniForm(v)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UAnimationForm;
