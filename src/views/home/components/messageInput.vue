<template>
  <div class="position-container">
    <div class="input-group" v-if="inputVisible">
      <Input
        class="input-calss"
        ref="inputRef"
        v-model:value="inputVal"
        @keyup.enter="sendValue"
      />
      <img
        @click="sendValue"
        class="input-img"
        src="../../../assets/images/input-logo.png"
        alt=""
      />
    </div>
    <div class="input-group" v-if="textAreaVisible">
      <Input.TextArea
        class="input-calss text-area-class"
        ref="textAreaRef"
        v-model:value="textAreaVal"
      />
      <img
        @click="senTextAreaValue"
        class="input-img"
        src="../../../assets/images/input-logo.png"
        alt=""
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sendJsInputText } from "../godotToJs";
import { Input } from "ant-design-vue";
import { nextTick, ref } from "vue";
const inputVisible = ref<boolean>(false);
const inputVal = ref<string>("");
const inputRef = ref();
window.openGodotChatInput = () => {
  inputVal.value = "";
  inputVisible.value = !inputVisible.value;
  nextTick(() => {
    inputVisible.value && inputRef.value.focus();
  });
};
window.godotChatInputClose = () => {
  inputVisible.value = false;
};
function sendValue() {
  sendJsInputText(inputVal.value);
  inputVisible.value = false;
}

const textAreaVisible = ref<boolean>(false);
const textAreaVal = ref<string>("");
const textAreaRef = ref();
window.openGodotEditorInput = () => {
  console.error("showinput");
  textAreaVal.value = "";
  textAreaVisible.value = !textAreaVisible.value;
  nextTick(() => {
    textAreaVisible.value && textAreaRef.value.focus();
  });
};
window.godotEditorInputClose = () => {
  textAreaVisible.value = false;
};
function senTextAreaValue() {
  sendJsInputText(textAreaVal.value);
  textAreaVisible.value = false;
}
</script>
<style lang="scss" scoped>
.position-container {
  position: fixed;
  z-index: 9999;
  top: 0;
  width: 100%;
}
.input-group {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  .input-calss {
    margin-right: 20px;
    border: none;
    box-shadow: none;
    border: 2px #9747ffed solid;
    color: #ffffff;
    border-radius: 20px;
    background-color: rgba($color: #000000, $alpha: 0.85);
  }
  .text-area-class {
    height: 90px;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  .input-img {
    width: 35px;
    height: 35px;
    cursor: pointer;
  }
}
</style>
