<template>
  <div class="comp-wrap cursor-pointer" :class="codeClass">
    <div
      class="show-code flex justify-center items-center"
      @click="isOpen = !isOpen"
    >
      <span class="pre-value">{{ activeCode }}</span>
      <i class="iconfont icon-arrow-down" :class="arrowClass" />
    </div>
    <div class="select_wrap" v-show="isOpen">
      <!-- <div class="search_wrap">
        <i class="iconfont icon-search" />
        <input type="text" class="seach_input" placeholder="搜索" v-model="searchCity" />
      </div> -->
      <div class="select-item_wrap">
        <div
          class="select_item flex justify-between items-center"
          v-for="item in filterPhonePrefixData"
          :key="`${item.code}${item.city}`"
          @click="selectCode(item.code)"
        >
          <span class="code">{{ item.code }}</span>
          <span class="city">{{ item.city }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { phonePrefixData } from "@/utils/common";

export default defineComponent({
  name: "PhonePrefix",
  props: {
    defaultCode: {
      type: String,
      default: "+86",
    },
  },
  emits: ["selectCode"],
  setup(props, { emit }) {
    const activeCode = ref(props.defaultCode);
    const isOpen = ref(false);
    const codeClass = computed(() => {
      return isOpen.value ? "code-active" : "code-inactive";
    });
    const arrowClass = computed(() => {
      return isOpen.value ? "arrow-up" : "";
    });
    const selectCode = (code: string) => {
      activeCode.value = code;
      isOpen.value = false;
      emit("selectCode", code);
    };
    const searchCity = ref("");
    const filterPhonePrefixData = ref(phonePrefixData);
    watch(searchCity, (value) => {
      if (value) {
        filterPhonePrefixData.value = phonePrefixData.filter(
          (v) => v.city.indexOf(value) !== -1
        );
      } else {
        filterPhonePrefixData.value = phonePrefixData;
        console.log(filterPhonePrefixData.value);
      }
    });
    return {
      activeCode,
      filterPhonePrefixData,
      codeClass,
      isOpen,
      arrowClass,
      selectCode,
      searchCity,
    };
  },
});
</script>
<style lang="scss" scoped>
@keyframes slide-in-top {
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.comp-wrap {
  position: relative;
  .select_wrap {
    position: absolute;
    top: 70px;
    height: 260px;
    width: 249px;
    background-color: #fff;
    border-radius: 23px;
    padding: 23px 26px;
    box-sizing: border-box;
    overflow: hidden;
    z-index: 999;
    font-size: 14px;
    color: #fff;
    animation: slide-in-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    .search_wrap {
      position: relative;
      .icon-search {
        position: absolute;
        left: 10px;
        top: 50%;
        margin-top: -12px;
      }
      .seach_input {
        width: 100%;
        height: 34px;
        background-color: #950dc5;
        padding-left: 40px;
        font-size: 14px;
      }
      .seach_input::webkit-input-placeholder {
        color: #fff !important;
      }
      .seach_input::-moz-placeholder {
        color: #fff !important;
      }
      .seach_input::placeholder {
        color: #fff !important;
      }
    }
    .select-item_wrap {
      overflow-y: scroll;
      height: 100%;
      &::-webkit-scrollbar {
        width: 0;
      }
      // padding: 20px 0;
    }
    .select_item {
      padding: 2px;
      color: $spaceUColor;
      font-size: 16px;
      .code {
        display: inline-block;
        width: 50px;
        font-weight: 700;
      }
      .city {
        display: inline-block;
        font-weight: 500;
        text-align: right;
      }
    }
    .select_item:hover {
      background-color: #950dc5;
      color: #fff;
    }
  }
  .show-code {
    width: 84px;
    height: 46px;
    border-radius: 22px 0 0 22px;
    font-size: 15px;
    font-weight: 500;
    border: 1px solid #fff;
    border-right: none;
    .pre-value {
      margin-right: 10px;
    }
    .arrow-up {
      transform: rotate(-180deg) !important;
    }
    .code-arrow {
      transform: rotate(-90deg);
      font-size: 12px;
      font-weight: 600;
      margin-left: 7px;
    }
  }
  .show-code {
    color: #fff;
  }
  .select_wrap {
    width: 246px;
  }
}
</style>
