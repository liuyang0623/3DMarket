<template>
  <div id="captcha"></div>
</template>
<script lang="ts">
import { captchaInit } from "@/utils/oauth";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "Captcha",
  emits: ["captchaSuccess"],
  setup(_, { emit }) {
    onMounted(() => {
      captchaInit("#captcha", "en", (data: any) => {
        emit("captchaSuccess", data);
      });
    });
  },
});
</script>
<style lang="scss">
#captcha {
  width: 100%;
  ._nc {
    .stage {
      padding: 0;
      .slider {
        border-radius: 25px;
        background-color: #7700a1;
        border: 1px solid #fff;
        width: 100%;
        left: 0;
        right: 0;
        // box-sizing: border-box;
        .track {
          border-radius: 25px 0 0 25px;
          .bg-green {
            background-color: #fff;
            color: #7700a1;
          }
        }
        .label {
          // background: #fff;
          background-clip: text;
        }
        .button {
          border-radius: 25px;
          .icon-slide-arrow {
            color: #7700a1;
            font-weight: 700;
          }
          .icon-ok {
            width: 100%;
            height: 100%;
            font-size: 54px;
            left: -2px;
            top: -5px;
            color: #7700a1;
          }
        }
      }
    }
  }
}
</style>
