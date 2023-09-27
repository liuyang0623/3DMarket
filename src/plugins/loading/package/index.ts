import Loading from "./index.vue";

interface LoadingProps {
  type?: any;
  visible?: boolean;
  duration?: number;
  text?: string;
}

// 插件注册
import { createVNode, render } from "vue";

const Ele = function (props: LoadingProps) {
  const id = "spaceu-nft-loading";
  const div = document.querySelector("#" + id);

  // visible = false并且有dom的情况下证明当前loading状态是现实，hideloading执行移除loading操作
  // 其余情况走创建loading逻辑
  if (!props.visible && div) {
    document.body.removeChild(div);
  } else {
    const container = document.createElement("div");
    container.id = id;
    const vm = createVNode(Loading, { id, ...props });
    render(vm, container);
    document.body.appendChild(container);
  }
};

export default {
  showLoading(text: string) {
    Ele({ visible: true, text });
  },
  hideLoading() {
    Ele({ visible: false });
  },
};
