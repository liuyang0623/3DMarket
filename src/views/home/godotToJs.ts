import router from "@/router";
import { useUser } from "@/stores/user";
import { getQueryString, removeCookies } from "@/utils/common";
import { sceneConfig } from "../../config/sceneConfig";
const Godot = () => {
  return document.getElementById("godotContent").contentWindow;
};
export const sendUserInfo = () => {
  const userStore = useUser();
  const userInfo = userStore.getUserInfo;
  const token = userStore.getToken;
  const sceneInstanceResponse = userStore.getSceneInstanceResponse;
  const sceneData = sceneConfig[window.location.hostname];
  const params: any = {
    token: token,
    userId: userInfo.user_id,
    userInfo: userInfo,
    scene_instance_response: sceneInstanceResponse,
    instanceId: sceneData?.instanceId || "",
    type: sceneData?.type || 1,
  };
  const hostWhite = [
    "localhost",
    "testnode.wdabuliu.com",
    "space3d.wdabuliu.com",
  ];
  if (hostWhite.includes(location.hostname) && getQueryString("instanceId")) {
    params["instanceId"] = getQueryString("instanceId");
  }
  console.log("params", params);
  Godot().gatewayToGodot.newEvent("getTokenUserId", JSON.stringify(params));
};

export const clearToken = () => {
  window.localStorage.clear();
  removeCookies();
  router.push("/login");
};
export const sendJsInputText = (data: string) => {
  console.log(data);
  Godot().gatewayToGodot.newEvent(
    "jsInputText",
    JSON.stringify({ result: data })
  );
};
export const sendFileUrl = (data: any, acceptMap: number) => {
  console.error(JSON.stringify({ result: data, type: acceptMap }));
  Godot().gatewayToGodot.newEvent(
    "godotFileInput",
    JSON.stringify({ result: data, type: acceptMap })
  );
};
export const sendAsrResult = (data: any) => {
  console.log(
    JSON.stringify({ type: "ASRStopCallback", params: data }),
    "xxxx"
  );
  Godot().gatewayToGodot.newEvent(
    "ASRStopCallback",
    JSON.stringify({ type: "ASRStopCallback", params: data })
  );
};
