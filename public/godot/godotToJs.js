window.addEventListener("load", () => {
  window.gatewayToGodot = gatewayToGodot;
  // Called 20 times per second
  window.setInterval(() => {
    if (gatewayToJS.hasEvent()) {
      do {
        const event = gatewayToJS.popEvent();
        onEvent(event.name, event.data);
      } while (gatewayToJS.hasEvent());

      gatewayToJS.clearEventsArray();
    }
  }, 50);
});

const onEvent = (eventName, eventData) => {
  switch (eventName) {
    case "ready":
      console.log("ready");
      break;
    case "message_from_godot":
      alert(eventData);
      break;
    case "godotGetTokenUserId":
      window.parent.sendUserInfoEvent();
      break;
    case "godotTokenInvalid":
      window.parent.clearLoginToken();
      break;
    case "GodotGMEMessage":
      window.parent.sendGemOperation(JSON.parse(eventData));
      break;
    case "godotChatInput":
      window.parent.openGodotChatInput();
      break;
    case "godotChatInputClose":
      window.parent.godotChatInputClose();
      break;
    case "godotEditorInput":
      window.parent.openGodotEditorInput();
      break;
    case "godotEditorInputClose":
      window.parent.godotEditorInputClose();
      break;
    case "godotFileInput":
      window.parent.openGodotFileInput(eventData);
      break;
    case "godotScreenOrientaion":
      window.parent.switchScreen(eventData);
      break;
    case "ASRStart":
      window.parent.startSpeech();
      break;
    case "ASRStop":
      window.parent.stopSpeech();
      break;
    default:
      console.log("Unexpected event:", eventName, eventData);
  }
};
