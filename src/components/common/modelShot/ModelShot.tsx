import { FC, useState, useRef, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import { dataURLtoBlob } from "@/utils/common";
import { uploadFile } from "@/api/sys";
import "./modelShot.scss";
import { message } from "antd";

interface ModelShotPorpsI {
  src: string;
  onSuccess: Function;
}
const ModelShot: FC<ModelShotPorpsI> = (props) => {
  const { src, onSuccess } = props;
  const modelShotRef = useRef<any>(null);
  const [singleImg, setSingleImg] = useState("");
  const [mutiImg, setMutiImg] = useState("");
  const [base64Imgs, setBase64Imgs] = useState<any>([]);

  const uploadImg = async (blob: Blob, saveFunc: Function) => {
    const formData = new FormData();
    formData.append("file", blob);
    const res = await uploadFile(formData);
    if (res.errcode === 0) {
      saveFunc(res.data.url);
    } else {
      message.error(res.msg);
    }
  };

  const createMutiImage = useCallback(() => {
    const el: any = document.getElementById("mutiImg");
    html2canvas(el, {
      backgroundColor: null,
      useCORS: true,
    }).then(async (canvas: any) => {
      const base64Url = canvas.toDataURL("image/png");
      const blob = dataURLtoBlob(base64Url);
      uploadImg(blob, setMutiImg);
    });
  }, []);

  useEffect(() => {
    if (singleImg && mutiImg) {
      onSuccess({ singleImg, mutiImg });
    }
  }, [singleImg, mutiImg, onSuccess]);

  const [currentAngle, setCurrentAngle] = useState(0);
  const requestRef = useRef<any>();
  const previousTimeRef = useRef<any>();
  useEffect(() => {
    if (modelShotRef.current) {
      const animate = async (time: any) => {
        if (previousTimeRef.current !== undefined) {
          setBase64Imgs((pre: any) => [
            ...pre,
            modelShotRef.current?.toDataURL(),
          ]);
          setCurrentAngle((angle) => angle + 24);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
      };
      if (currentAngle === 360) {
        createMutiImage();
        cancelAnimationFrame(requestRef.current);
      }
      if (currentAngle < 360 && singleImg) {
        // 开始动画
        requestRef.current = requestAnimationFrame(animate);
      }
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [currentAngle, base64Imgs, singleImg, createMutiImage]);

  useEffect(() => {
    if (modelShotRef.current) {
      modelShotRef.current.addEventListener("progress", async (event: any) => {
        if (event.detail.totalProgress === 1) {
          setTimeout(() => {
            const screenShot = modelShotRef.current?.toDataURL();
            console.log(screenShot);
            uploadImg(dataURLtoBlob(screenShot), setSingleImg);
          }, 1000);
        }
      });
    }
  }, []);
  return (
    <div className="model-shot_wrap">
      <model-viewer
        style={{ width: "800px", height: "800px" }}
        ref={modelShotRef}
        src={src}
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
      ></model-viewer>
      <div className="img_wrap" id="mutiImg">
        {base64Imgs.map((v: any, index: number) => {
          return <img src={v} key={index} className="img-item" alt="" />;
        })}
      </div>
    </div>
  );
};

export default ModelShot;
