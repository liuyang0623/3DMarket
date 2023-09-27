<template>
  <div class="godot-container">
    <!--容器，用来承接Audio标签， 请务必留意，不能忽略-->
    <div id="gme-audio-wrap"></div>
    <!-- <button
      class="screen-btn"
      @click="isHorizontal = !isHorizontal"
      v-if="!isRoateScreen"
    >
      切换为{{ isHorizontal ? "竖屏" : "横屏" }}
    </button> -->
    <iframe
      id="godotContent"
      :src="baseUrl + src"
      :style="isHorizontal ? horizontalStyle : undefined"
      :class="`iframe-main ${
        isHorizontal && !isRoateScreen && 'horizontal-screen'
      }`"
      ref="frameRef"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
import { isMobile } from "@/utils/common";
import { ref, onMounted } from "vue";
const baseUrl = import.meta.env.VITE_APP_BASEURL;
const horizontalStyle = {
  width: `${window.innerHeight}px`,
  height: `${window.innerWidth}px`,
};
defineProps<{
  src: string;
}>();
const isHorizontal = ref(false);
const isRoateScreen = ref(
  isMobile.any() ? window.innerHeight < window.innerWidth : false
);
window.switchScreen = (status: any) => {
  if (!isMobile.any()) return;
  isHorizontal.value = Number(status) === 1;
};
onMounted(() => {
  window.addEventListener("resize", (e) => {
    // if (!isMobile.any()) return;
    if (e.target.innerHeight < e.target.innerWidth) {
      isHorizontal.value = false;
      isRoateScreen.value = true;
    } else {
      isRoateScreen.value = false;
    }
  });
});
</script>
<style scoped>
.godot-container {
  width: 100%;
  height: 100%;
}
.iframe-main {
  width: 100%;
  height: 100%;
}
.horizontal-screen {
  position: absolute;
  top: 0;
  left: 100vw;
  transform: rotate(90deg);
  transform-origin: 0 0;
}
.screen-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
}
</style>
