export const tencentSpeechConfig = {
  secretKey: "VjgMlumNkriIbfU2JkunPkpdAQTFkyvc",
  secretId: "AKIDsYz92ezB6k7F6gz2oJXVDeohKglZ7OO7",
  appId: 1256824318,
};

/** 获取签名 start */
function toUint8Array(wordArray: any) {
  // Shortcuts
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;

  // Convert
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return u8;
}

function Uint8ArrayToString(fileData: any) {
  let dataString = "";
  for (let i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }
  return dataString;
}

// 签名函数示例
function signCallback(signStr: any) {
  const secretKey = tencentSpeechConfig.secretKey;
  const hash = window.CryptoJSTest.HmacSHA1(signStr, secretKey);
  const bytes = Uint8ArrayToString(toUint8Array(hash));
  return window.btoa(bytes);
}

export const tencentParams = {
  signCallback: signCallback, // 鉴权函数
  // 用户参数
  secretid: tencentSpeechConfig.secretId,
  appid: tencentSpeechConfig.appId,
  // 实时识别接口参数
  engine_model_type: "16k_zh", // 因为内置WebRecorder采样16k的数据，所以参数 engineModelType 需要选择16k的引擎，为 '16k_zh'
  // 以下为非必填参数，可跟据业务自行修改
  voice_format: 1,
  hotword_id: "08003a00000000000000000000000000",
  needvad: 1,
  filter_dirty: 1,
  filter_modal: 2,
  filter_punc: 0,
  convert_num_mode: 1,
  word_info: 2,
};
