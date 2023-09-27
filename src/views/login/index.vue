<template>
  <div id="wx-login-id">
    <div class="login-wrap flex justify-center items-center fade-in">
      <LoginForm />
      <!-- <LingoModel
      :model="modelPosition"
      :orbitCamera="{ x: 200, z: 0, y: 280 }"
      @loadModel="loadModel"
    /> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import LoginForm from "@/components/common/LoginForm.vue";
import { tencentParams } from "../home/speech";
// import LingoModel from "@/components/model/LingoModel.vue";
// import { nextTick, ref } from "vue";
// const lights = [
//   {
//     type: "AmbientLight",
//     color: "#FFFFFF",
//   },
//   {
//     type: "DirectionalLight",
//     position: { x: 0, y: 10, z: 2 },
//     color: "#ECFFD5",
//     intensity: 0.2,
//   },
//   {
//     type: "PointLight",
//     color: "#000000",
//     position: { x: 0, y: 0, z: 0 },
//     intensity: 0,
//   },
//   {
//     type: "HemisphereLight",
//     skyColor: "#EAFFFF",
//     groundColor: "#5B5A58",
//     position: { x: 2, y: 2, z: 2 },
//   },
// ];
// const rotation = ref();
// rotation.value = {
//   x: 0,
//   y: 0,
//   z: 0,
// };
// const loadModelCb = () => {
//   requestAnimationFrame(loadModelCb);
//   rotation.value.y -= 0.003;
// };
// const modelPosition = ref({
//   x: 350,
//   z: 80,
//   y: 9999999,
//   scale: 8,
// });
// const showPage = ref(false);
// const loadModel = async () => {
//   showPage.value = true;
//   await nextTick();
//   modelPosition.value.y = 50;
// };
</script>
<style lang="scss">
#wx-login-id,
#wx-login-id iframe {
  width: 100%;
  height: 100%;
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.login-wrap {
  background: linear-gradient(180deg, #b8ddff 39.11%, #ffffff 142.77%);
  height: 100vh;
  width: 100vw;
}
.fade-in {
  animation: fade-in 0.3s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}
</style>
