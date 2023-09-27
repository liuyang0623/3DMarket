<template>
  <div class="upload_wrap" v-if="showUpload">
    <Upload
      :showUploadList="false"
      @change="handleChange"
      :action="uploadAction"
      :headers="{ Authorization: token }"
      :accept="acceptMap[uploadType].accept"
      :maxCount="1"
    >
      <button class="upload-file_btn">
        {{ acceptMap[uploadType].btnText }}
      </button>
    </Upload>
    <video
      @loadeddata="createPreImg"
      class="content-video"
      style="position: fixed; left: -99999px; top: -99999px"
      :src="videoUrl"
      crossorigin="anonymous"
      preload="auto"
    ></video>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { Upload, message } from "ant-design-vue";
import { sendFileUrl } from "../godotToJs";
import { dataURLtoBlob } from "@/utils/common";
import { uploadFile } from "@/api/home";
const token = `Bearer ${localStorage.getItem("FE_LIBRARY_TOKEN")}`;
const uploadAction = import.meta.env.VITE_GLOB_UPLOAD_ACTION;

const showUpload = ref(false);
const uploadType = ref(0);
window.openGodotFileInput = (status: any) => {
  console.error(status);
  showUpload.value = true;
  uploadType.value = Number(status);
};

const videoUrl = ref("");
const createPreImg = async (event: any) => {
  const videoEle = event.target; // 当前video dom节点
  videoEle.currentTime = 1; // 设置视频开始播放时间（因为有些手机第一帧显示黑屏，所以这里选取视频的第一秒作为封面）
  // 创建canvas元素 并设置canvas大小等于video节点的大小
  const canvas = document.createElement("canvas");
  const scale = 0.8; // 压缩系数
  canvas.width = videoEle.videoWidth * scale;
  canvas.height = videoEle.videoHeight * scale;

  // canvas画图
  canvas
    .getContext("2d")
    .drawImage(videoEle, 0, 0, canvas.width, canvas.height);

  // 把canvas转成base64编码格式
  const imgSrc = canvas.toDataURL("image/png");
  const blob = dataURLtoBlob(imgSrc);
  const formData = new FormData();
  formData.append("file", blob, "cover.png");
  const result = await uploadFile(formData);
  console.log(result.data.url);
  if (result.errcode === 0) {
    sendFileUrl({ picUrl: result.data.url, videoUrl: videoUrl.value }, 1);
    showUpload.value = false;
  }
};
const handleChange = (info: any) => {
  if (info.file.status === "done") {
    message.success(`${info.file.name} file uploaded successfully`);
    if (info.file.response.data) {
      if (uploadType.value === 0) {
        sendFileUrl({ picUrl: info.file.response.data }, 0);
        showUpload.value = false;
      } else {
        videoUrl.value = info.file.response.data;
      }
    }
  }
};
// 上传文件
const acceptMap = {
  0: {
    accept: "image/png,image/jpg,image/webp,image/jpeg",
    btnText: "Upload Image",
  },
  1: {
    accept: "video/mp4,video/mov",
    btnText: "Upload Video",
  },
};
</script>
<style scoped>
.upload_wrap {
  width: 25vw;
  height: 25vw;
  background-color: #333232;
  position: fixed;
  top: 50%;
  margin-top: -12.5vw;
  left: 50%;
  margin-left: -12.5vw;
  z-index: 999;
  border-radius: 30px;
}
.upload-file_btn {
  width: 25vw;
  height: 25vw;
  font-size: 40px;
  font-weight: 800;
  color: #fff;
}
</style>
