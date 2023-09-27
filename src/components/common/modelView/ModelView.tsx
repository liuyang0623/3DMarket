import { FC, useState, useRef, useEffect, useCallback } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { useTranslation } from "react-i18next";
import { Spin, message } from "antd";
import { uploadFile } from "@/api/sys";
import { dataURLtoBlob } from "@/utils/common";
import html2canvas from "html2canvas";
import "@google/model-viewer";
import "./modelView.scss";

interface ModelViewPropsI {
  modelData: any;
  loadingText: string;
  type: "detail" | "operate";
  size?: string;
  getPreivewImg?: Function;
  getSingleImg?: Function;
  isAdd?: boolean;
  getAniList?: Function;
}
const ModelView: FC<ModelViewPropsI> = (props) => {
  const { file, figure } = props.modelData;
  const {
    loadingText,
    type,
    size,
    getPreivewImg,
    getSingleImg,
    isAdd,
    getAniList,
  } = props;

  const { t } = useTranslation();
  const modelRef = useRef<Element | any>(null);
  const [percent, setPercent] = useState(0);
  const [curAni, setCurAni] = useState("");
  const [animations, setAnimations] = useState<any>([]);
  const [showAction, setShowAction] = useState(false);

  const [loading, setLoading] = useState(true);
  const [modelMetaData, setModelMetaData] = useState<any>({
    faceCount: 0,
    textureCount: 0,
    materialCount: 0,
    animationCount: 0,
    size: size,
  });

  const modelMetaKeys: any = [
    {
      label: t("model.operate.upload.size"),
      key: "size",
    },
    {
      label: t("model.operate.upload.faceCount"),
      key: "faceCount",
    },
    {
      label: t("model.operate.upload.material"),
      key: "material",
    },
    {
      label: t("model.operate.upload.animationCount"),
      key: "animationCount",
    },
  ];

  const calcModelMetaData = (gltf: any) => {
    gltf.scene.traverse(function (node: any) {
      if (node instanceof THREE.Mesh) {
        setModelMetaData((pre: any) => ({
          ...pre,
          faceCount: pre.faceCount + node.geometry.index.count / 3,
        }));
        if (Array.isArray(node.material)) {
          setModelMetaData((pre: any) => ({
            ...pre,
            materialCount: pre.materialCount + node.material.length,
          }));
        } else {
          setModelMetaData((pre: any) => ({
            ...pre,
            materialCount: pre.materialCount + 1,
          }));
        }
        if (node.material.map) {
          setModelMetaData((pre: any) => ({
            ...pre,
            textureCount: pre.textureCount + 1,
          }));
        }
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.addEventListener("progress", (event: any) => {
        setPercent(event.detail.totalProgress * 100);
      });
    }
  }, []);

  const [isCallback, setIsCalback] = useState(false);
  const memoGetAniList = useCallback(
    (list: Array<any>) => {
      if (getAniList) {
        getAniList(list);
      }
    },
    [getAniList]
  );
  const formatAniList = useCallback(
    (list: Array<any>) => {
      const formatAniArray: any = [];
      list.forEach((v: any, index: number) => {
        formatAniArray.push({
          action_id: "",
          animation: v.name,
          chinese_name: `动画${index + 1}`,
          name: v.name,
        });
      });
      !isCallback && memoGetAniList(formatAniArray);
      setIsCalback(true);
    },
    [memoGetAniList, isCallback]
  );
  useEffect(() => {
    if (file && isAdd) {
      const loader = new GLTFLoader();
      loader.load(file, (gltf: any) => {
        if (gltf.animations.length) {
          formatAniList(gltf.animations);
        }
      });
    }
  }, [file, formatAniList, isAdd]);
  useEffect(() => {
    if (file) {
      const loader = new GLTFLoader();
      loader.load(file, (gltf: any) => {
        setAnimations(gltf.animations);
        // if (gltf.animations.length) {
        //   formatAniList(gltf.animations);
        // }
        setModelMetaData((pre: any) => ({
          ...pre,
          animationCount: gltf.animations.length,
        }));
        calcModelMetaData(gltf);
      });
    }
  }, [file, isAdd]);

  useEffect(() => {
    setModelMetaData((pre: any) => ({
      ...pre,
      size,
    }));
  }, [size]);

  // 截图文件上传
  const uploadImg = async (blob: Blob, callback?: Function) => {
    const formData = new FormData();
    formData.append("file", blob, "cover.png");
    const res = await uploadFile(formData);
    if (res.errcode === 0) {
      callback && callback(res.data.url);
    } else {
      message.error(res.msg);
    }
  };
  // 单图截取控制宽高
  const shotSingle = useCallback(async () => {
    // 生成截图
    const base64 = await modelRef.current?.toDataURL();
    uploadImg(dataURLtoBlob(base64), getSingleImg);
  }, [getSingleImg]);

  const [isModelShow, setIsModelShow] = useState(false);
  // 单图截取
  useEffect(() => {
    if (modelRef.current && isAdd) {
      modelRef.current.addEventListener("model-visibility", async (e: any) => {
        if (e.detail.visible) {
          shotSingle();
          setIsModelShow(true);
        }
      });
    }
  }, [isAdd]);

  // preview示意图截图
  const [base64Imgs, setBase64Imgs] = useState<any>([]);
  const [currentAngle, setCurrentAngle] = useState(0);
  const currentAngleRef = useRef(0);
  const requestRef = useRef<any>();
  const createPreivewImage = useCallback(() => {
    const el: any = document.getElementById("previewImg");
    html2canvas(el, {
      backgroundColor: null,
      useCORS: true,
    }).then(async (canvas: any) => {
      const base64Url = canvas.toDataURL("image/png");
      const blob = dataURLtoBlob(base64Url);
      uploadImg(blob, getPreivewImg);
    });
  }, [getPreivewImg]);
  const animate = useCallback(async (time: any) => {
    console.log(currentAngleRef.current, "currentAngleRef");
    setCurrentAngle((angle) => angle + 24);
    const res = await modelRef.current?.toDataURL();
    setBase64Imgs((pre: any) => [...pre, res]);
    currentAngleRef.current += 24;
  }, []);

  useEffect(() => {
    if (currentAngleRef.current === 360) {
      createPreivewImage();
    }
  }, [currentAngleRef, currentAngle]);

  useEffect(() => {
    if (modelRef.current && getPreivewImg && isAdd && isModelShow) {
      if (currentAngleRef.current === 360) {
        cancelAnimationFrame(requestRef.current);
      } else {
        requestRef.current = requestAnimationFrame(animate);
      }
      return () => cancelAnimationFrame(requestRef.current);
    }
  }, [
    getPreivewImg,
    animate,
    currentAngle,
    isAdd,
    isModelShow,
    requestRef,
    currentAngleRef,
  ]);

  return (
    <div className="model-view_wrap">
      <div className="model-show">
        {!!animations.length && type === "detail" && (
          <div className="ani-action_wrap">
            <button
              className="ani-btn"
              onClick={() => setShowAction(!showAction)}
            >
              <i className="iconfont icon-ac"></i>
            </button>
            {showAction && (
              <div className="action-picker">
                {animations.map((v: any) => {
                  return (
                    <button
                      className={`action-item ${
                        curAni === v.name && "active-item"
                      }`}
                      key={v.uuid}
                      onClick={() => setCurAni(v.name)}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <model-viewer
          class="model-view"
          ref={modelRef}
          src={file}
          // camera-orbit="180deg 90deg 20m"
          camera-orbit={`${currentAngle}deg 90deg 20m`}
          max-field-of-view="80deg"
          min-field-of-view="40deg"
          max-camera-orbit="auto 100deg auto"
          interaction-prompt="none"
          camera-controls=""
          orientation="0deg 0deg 145deg"
          autoplay
          shadow-intensity="3"
          exposure=".4"
          ar-status="not-presenting"
          poster={figure}
          animation-name={curAni}
        >
          {percent < 100 && (
            <div slot="progress-bar">
              <div className="loading_wrap">
                <p className="loading-msg">{loadingText}</p>
                <div className="model-progress-bar">
                  <div
                    className="model-progress-bar-inner"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </model-viewer>
      </div>
      {type === "operate" && (
        <Spin spinning={loading}>
          <div className="model-meta_wrap">
            {modelMetaKeys.map((v: any) => {
              return (
                <div className="data-item" key={v.key}>
                  <div className="left">
                    <span className="data-title">{v.label}</span>
                  </div>
                  <div className="right">
                    {v.key === "material" ? (
                      <span>{`${modelMetaData["textureCount"]}${t(
                        "model.operate.upload.unit"
                      )}${t("model.operate.upload.texture")} + ${
                        modelMetaData["materialCount"]
                      }${t("model.operate.upload.unit")}${t(
                        "model.operate.upload.materials"
                      )}`}</span>
                    ) : (
                      <span>{modelMetaData[v.key]}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Spin>
      )}
      {getPreivewImg && (
        <div className="img_wrap" id="previewImg">
          {base64Imgs.map((v: any, index: any) => {
            return <img className="img-item" src={v} key={index} alt="" />;
          })}
        </div>
      )}
    </div>
  );
};

export default ModelView;
