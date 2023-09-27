<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

type LoadingType = "iconfont" | "image";
interface LoadingProps {
  color?: string;
  size?: number;
  icon?: string;
  text?: string;
  type?: LoadingType;
  visible?: boolean;
  id?: string;
  duration?: number;
}
const loadingProps = withDefaults(defineProps<LoadingProps>(), {
  color: "#000",
  size: 16,
  icon: "icon-loading1",
  text: "加载中...",
  type: "iconfont",
  visible: false,
  id: "spaceu-nft-loading",
  duration: 3000,
});

const showLoading = ref(false);
const isLock = ref(false);
const lockTimer = ref(undefined);
const showLoadingTimer = ref(undefined);

watch(
  () => loadingProps.visible,
  (val: boolean) => {
    console.log(val);
    showLoading.value = val;
    if (val) {
      showFunc();
    } else {
      hideFunc();
    }
  }
);

const hideFunc = () => {
  lockTimer.value = setTimeout(() => {
    isLock.value = false;
  }, loadingProps.duration - 300);

  showLoadingTimer.value = setTimeout(() => {
    showLoading.value = false;
    document.body.removeChild(document.querySelector("#" + loadingProps.id));
  }, loadingProps.duration);
};

const showFunc = () => {
  if (showLoading.value) return;
  clearTimeout(lockTimer.value);
  clearTimeout(showLoadingTimer.value);
  showLoading.value = true;
  isLock.value = true;
  //   hideFunc();
};

onMounted(() => showFunc());
</script>

<template>
  <div
    v-if="showLoading"
    :class="{ loadingZoomOut: !isLock }"
    class="spaceu-loading-wrap loadingZoomIn"
  >
    <div class="loading-box">
      <i :class="`iconfont loading-icon ${icon}`"></i>
      <span class="loading-title">{{ text }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.spaceu-loading-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  z-index: 999;
}
.spaceu-loading-wrap .loading-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: $spaceUColor;
}
.loading-icon {
  font-size: 40px;
  font-weight: 900;
  animation: rotate-center 0.8s linear infinite both;
}
.loadingZoomIn {
  animation: zoomIn 0.3s linear;
}
.loadingZoomOut {
  animation: zoomOut 0.3s linear;
}
@keyframes zoomIn {
  0%,
  30% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes zoomOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}
@keyframes rotate-center {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
