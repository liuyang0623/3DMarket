<template>
  <div class="home-container">
    <MessageInput />
    <GodotUpload />
    <godotIframe src="godot/index.html" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MessageInput from "./components/messageInput.vue";
import GodotUpload from "./components/GodotUpload.vue";
import godotIframe from "../iframe/index.vue";
import { setGodotConfig } from "./godotConfig";
import { tencentParams } from "./speech";
import { message } from "ant-design-vue";
import { sendAsrResult } from "./godotToJs";
setGodotConfig(window.location.pathname);

const tencentSpeechTool = ref<any>(null);
const resultText = ref("");
const startSpeech = () => {
  tencentSpeechTool.value = new WebAudioSpeechRecognizer(tencentParams);
  // 开始识别
  tencentSpeechTool.value.OnRecognitionStart = (res: any) => {
    resultText.value = "";
    console.log("开始识别", res);
  };
  // 一句话开始
  tencentSpeechTool.value.OnSentenceBegin = (res: any) => {
    console.log("一句话开始", res);
  };
  // 识别变化时
  tencentSpeechTool.value.OnRecognitionResultChange = (res: any) => {
    console.log("识别变化时", res);
  };
  // 一句话结束
  tencentSpeechTool.value.OnSentenceEnd = async (res: any) => {
    console.log("一句话结束", res);
    resultText.value += res.voice_text_str;
    console.error(resultText.value);
  };
  // 识别结束
  tencentSpeechTool.value.OnRecognitionComplete = (res: any) => {
    console.log("识别结束", res);
  };
  // 识别错误
  tencentSpeechTool.value.OnError = (res: any) => {
    console.log("识别失败", res);
    sendAsrResult({ error: true, text: "" });
  };
  tencentSpeechTool.value.start();
};

const stopSpeech = () => {
  if (!tencentSpeechTool.value) {
    message.error("tencentSpeechTool not install!");
    return;
  }
  tencentSpeechTool.value.stop();
};

window.startSpeech = () => {
  startSpeech();
};

window.stopSpeech = async () => {
  await stopSpeech();
  setTimeout(() => {
    sendAsrResult({ error: false, text: resultText.value });
  }, 200);
};
</script>
<style lang="scss" scoped>
.home-container {
  height: 100%;
  overflow-y: hidden;
}
</style>
