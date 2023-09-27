import request from "@/utils/http/request";
import { useUser } from "@/stores/user";
const sdkappid = "1400641936";
const authKey = "RijTw84k9H8j36tP";
var userIds: string[] = [];
let gmeAPI = new WebGMEAPI();
const onEvent = function (eventType, result) {
  // console.log("eventType", eventType);
  // console.log("result", result);
  if (eventType === gmeAPI.event.ITMG_MAIN_EVENT_TYPE_ENTER_ROOM) {
    console.log("进房成功");
    document
      .getElementById("godotContent")
      .contentWindow.gatewayToGodot.newEvent(
        "GodotGMEMessage",
        JSON.stringify({ type: "GmeEnterRoom", result: "1" })
      );
    
    setInterval(() => {
      const volumes: any = {};
      if (userIds == null || userIds.length == 0) {
        return;
      }
      userIds.forEach(userId => {
        const level = gmeAPI.GetRecvStreamLevel(userId);
        volumes[userId] = String(level);
      });
      document.getElementById("godotContent").contentWindow.gatewayToGodot.newEvent(
        "GodotGMEMessage",
        JSON.stringify({ type: "GmeVolume", volumes: volumes })
      );
    }, 50);
  } else if (eventType === gmeAPI.event.ITMG_MAIN_EVENT_TYPE_EXIT_ROOM) {
    console.log("退房成功");
  } else if (eventType === gmeAPI.event.ITMG_MAIN_EVENT_TYPE_ROOM_DISCONNECT) {
    console.log("房间断开连接");
  }
};

function initGMEWithSig(userSig: string, roomid: string) {
  const userStore = useUser();
  // const sceneInstanceResponse = userStore.getSceneInstanceResponse;
  // gmeAPI.Init(document, sdkappid, Number(sceneInstanceResponse.id) + 10000);
  const userInfoResponse = userStore.getUserInfo;
  gmeAPI.Init(document, sdkappid, userInfoResponse.user_id);
  gmeAPI.SetLogLevel(1);
  gmeAPI.SetTMGDelegate(onEvent);
  gmeAPI.EnterRoom(roomid, 1, userSig);
}

export const gemOperation = (data: { type: string; result: any }) => {
  console.log("加入房间1", data);
  const { type, result } = data;
  switch (type) {
    case "GmeStatus":
      if (result === "-1") {
        gmeAPI.ExitRoom();
      } else {
        EnterRoom(result);
      }
      break;
    case "GmeOpenSpeaker":
      setGmeOpenSpeaker(result);
      break;
    case "GmeOpenMrc":
      //移至
      // setGmeOpenMrc(result);
      break;
    case "GMEMicVolume":
      //开启关闭麦克风(因为gme调节麦克风音量问题 用开启关闭麦克风代替)
      setGmeOpenMrc(result);
      break;
    case "GmeVolume":
      getUsersVolume(result);
      break;
  }
};

export const EnterRoom = (roomid: string) => {
  request
    .get("/note/tencent/cloud/get/auth/buffer", {
      params: { room_id: roomid },
    })
    .then((res) => {
      const userSig = res.data.auth_buffer;
      initGMEWithSig(userSig, roomid);
    })
    .catch((error) => {
      console.error(error);
    });
};
const setGmeOpenSpeaker = (type: string) => {
  const flag = type === "1" ? true : false;
  const ret = gmeAPI.EnableSpeaker(flag);
  if (!ret) {
    console.error("EnableSpeaker failed");
  }
};

const setGmeOpenMrc = (type: string) => {
  const flag = type === "200" ? true : false;
  const enableMic = gmeAPI.EnableMic(flag);
  if (!enableMic) {
    console.error("EnableMic failed");
  }
};

const getUsersVolume = (res: string[]) => {
  userIds = res;
};
