import { gemOperation } from "./gme";
import { sendUserInfo, clearToken } from "./godotToJs";
export const setGodotConfig = (path: string) => {
  window.sendUserInfoEvent = sendUserInfo;
  window.clearLoginToken = clearToken;
  window.sendGemOperation = gemOperation;
  if (
    path.includes("character") ||
    location.hostname === "character.wdabuliu.com"
  ) {
    window.LOAD_GODOT_ZIP = "character.zip";
    window.LOAD_GODOT_ZIP_SIZE = 37900000;
  } else {
    window.LOAD_GODOT_ZIP = "godot.zip";
    window.LOAD_GODOT_ZIP_SIZE = 38548646;
  }
};
