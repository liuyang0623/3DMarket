import Cookies from "js-cookie";
import { sceneConfig } from "@/config/sceneConfig";
export const phoneReg = (number: string) => {
  const reg =
    /^1((3[0-9])|(4[1579])|(5[0-9])|(6[6])|(7[0-9])|(8[0-9])|(9[0-9]))\d{8}$/;
  return reg.test(number);
};

export const emailReg = (email: string) => {
  const reg =
    /[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/;
  return reg.test(email);
};

/**
 * 判定滚动到底部：st + wh = sh；
 * 允许误差
 */
export const scrollToBottom = (el: HTMLElement, offset: number = 10) => {
  const sh = el.scrollHeight; // 滚动总区域
  const st = el.scrollTop; // 滚动盒子距离顶部距离
  const wh = window.innerHeight; // 可视窗口高度
  return Math.abs(st + wh - sh) <= offset;
};

/**
 *
 * 生成随机数
 * @param {Number} length
 * @returns
 */
export const randomString = (length) => {
  if (!length) {
    console.warn("the type of argument must be the Number");
    return;
  }

  let str = Math.random().toString(36).substring(2);
  if (str.length >= length) {
    const res = str.substring(0, length);
    return res;
  } else {
    str += randomString(length - str.length);
    return str;
  }
};

export const getQueryString = (name: string) => {
  let res = null;
  if (window.location.href.indexOf("?") === -1) return null; //如果url中没有传参直接返回空
  //name存在先通过search取值如果取不到就通过hash来取
  res = getQuery(name, window.location.search.substring(1));
  if (res === null) res = getQuery(name, window.location.hash.split("?")[1]);
  console.log("结果", res);
  return res;
};
/**
 *
 * @param {String} 参数key
 * @param {String} 需要检索的字符串
 */
const getQuery = (name: string, query: string) => {
  if (typeof query !== "string" || typeof name !== "string") return null;
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = query.match(reg);
  return r === null ? null : decodeURIComponent(r[2]);
};

/**
 * 手机号全球区号数据
 */
// export const phonePrefixData = [
//   {
//     city: "中国大陆",
//     code: "+86",
//   },
//   {
//     city: "中国香港",
//     code: "+852",
//   },
//   {
//     city: "中国澳门",
//     code: "+853",
//   },
//   {
//     city: "中国台湾",
//     code: "+886",
//   },
//   {
//     city: "新加坡",
//     code: "+65",
//   },
//   {
//     city: "阿富汗",
//     code: "+93",
//   },
//   {
//     city: "阿尔巴尼亚",
//     code: "+355",
//   },
//   {
//     city: "阿尔格拉",
//     code: "+213",
//   },
//   {
//     city: "安道尔",
//     code: "+376",
//   },
//   {
//     city: "安哥拉",
//     code: "+244",
//   },
//   {
//     city: "安圭拉",
//     code: "+1264",
//   },
//   {
//     city: "阿森松岛",
//     code: "+247",
//   },
//   {
//     city: "安提瓜和巴布达",
//     code: "+1268",
//   },
//   {
//     city: "阿根廷",
//     code: "+54",
//   },
//   {
//     city: "亚美尼亚",
//     code: "+374",
//   },
//   {
//     city: "阿鲁巴",
//     code: "+297",
//   },
//   {
//     city: "澳大利亚",
//     code: "+61",
//   },
//   {
//     city: "奥地利",
//     code: "+43",
//   },
//   {
//     city: "阿塞拜疆",
//     code: "+994",
//   },
//   {
//     city: "巴哈马",
//     code: "+1242",
//   },
//   {
//     city: "巴林",
//     code: "+973",
//   },
//   {
//     city: "孟加拉国",
//     code: "+880",
//   },
//   {
//     city: "巴巴多斯",
//     code: "+1246",
//   },
//   {
//     city: "白俄罗斯",
//     code: "+375",
//   },
//   {
//     city: "比利时",
//     code: "+32",
//   },
//   {
//     city: "伯利兹",
//     code: "+501",
//   },
//   {
//     city: "贝宁",
//     code: "+229",
//   },
//   {
//     city: "百慕大",
//     code: "+1441",
//   },
//   {
//     city: "不丹",
//     code: "+975",
//   },
//   {
//     city: "玻利维亚",
//     code: "+591",
//   },
//   {
//     city: "波斯尼亚和黑塞哥维那",
//     code: "+387",
//   },
//   {
//     city: "博茨瓦纳",
//     code: "+267",
//   },
//   {
//     city: "巴西",
//     code: "+55",
//   },
//   {
//     city: "文莱",
//     code: "+673",
//   },
//   {
//     city: "保加利亚",
//     code: "+359",
//   },
//   {
//     city: "布基纳法索",
//     code: "+226",
//   },
//   {
//     city: "布隆迪",
//     code: "+257",
//   },
//   {
//     city: "柬埔寨",
//     code: "+855",
//   },
//   {
//     city: "喀麦隆",
//     code: "+237",
//   },
//   {
//     city: "加拿大",
//     code: "+1",
//   },
//   {
//     city: "佛得角",
//     code: "+238",
//   },
//   {
//     city: "开曼群岛",
//     code: "+1345",
//   },
//   {
//     city: "中非共和国",
//     code: "+236",
//   },
//   {
//     city: "乍得",
//     code: "+235",
//   },
//   {
//     city: "智利",
//     code: "+56",
//   },
//   {
//     city: "哥伦比亚",
//     code: "+57",
//   },
//   {
//     city: "科摩罗",
//     code: "+269",
//   },
//   {
//     city: "刚果共和国",
//     code: "+242",
//   },
//   {
//     city: "刚果民主共和国",
//     code: "+243",
//   },
//   {
//     city: "库克群岛",
//     code: "+682",
//   },
//   {
//     city: "哥斯达黎加",
//     code: "+506",
//   },
//   {
//     city: "科特迪沃",
//     code: "+225",
//   },
//   {
//     city: "克罗地亚",
//     code: "+385",
//   },
//   {
//     city: "古巴",
//     code: "+53",
//   },
//   {
//     city: "塞浦路斯",
//     code: "+357",
//   },
//   {
//     city: "+捷克共和国",
//     code: "+420",
//   },
//   {
//     city: "丹麦",
//     code: "+45",
//   },
//   {
//     city: "吉布提",
//     code: "+253",
//   },
//   {
//     city: "多米尼加",
//     code: "+1767",
//   },
//   {
//     city: "多米尼加共和国",
//     code: "+1809",
//   },
//   {
//     city: "厄瓜多尔",
//     code: "+593",
//   },
//   {
//     city: "埃及",
//     code: "+20",
//   },
//   {
//     city: "艾萨尔瓦多",
//     code: "+503",
//   },
//   {
//     city: "爱沙尼亚",
//     code: "+372",
//   },
//   {
//     city: "埃塞俄比亚",
//     code: "+251",
//   },
//   {
//     city: "法罗群岛",
//     code: "+298",
//   },
//   {
//     city: "斐济",
//     code: "+679",
//   },
//   {
//     city: "芬兰",
//     code: "+358",
//   },
//   {
//     city: "法国",
//     code: "+33",
//   },
//   {
//     city: "法属圭亚那",
//     code: "+594",
//   },
//   {
//     city: "法属波利尼西亚",
//     code: "+689",
//   },
//   {
//     city: "加蓬",
//     code: "+241",
//   },
//   {
//     city: "冈比亚",
//     code: "+220",
//   },
//   {
//     city: "格鲁吉亚",
//     code: "+995",
//   },
//   {
//     city: "德国",
//     code: "+94",
//   },
//   {
//     city: "加纳",
//     code: "+233",
//   },
//   {
//     city: "直布罗陀",
//     code: "+350",
//   },
//   {
//     city: "希腊",
//     code: "+30",
//   },
//   {
//     city: "格陵兰",
//     code: "+299",
//   },
//   {
//     city: "格林纳达",
//     code: "+1473",
//   },
//   {
//     city: "瓜德罗普",
//     code: "+590",
//   },
//   {
//     city: "关岛",
//     code: "+1671",
//   },
//   {
//     city: "危地马拉",
//     code: "+502",
//   },
//   {
//     city: "几内亚",
//     code: "+240",
//   },
//   {
//     city: "根西",
//     code: "+44",
//   },
//   {
//     city: "几内亚",
//     code: "+224",
//   },
//   {
//     city: "圭亚那",
//     code: "+592",
//   },
//   {
//     city: "海地",
//     code: "+509",
//   },
//   {
//     city: "洪都拉斯",
//     code: "+504",
//   },
//   {
//     city: "缅甸",
//     code: "+95",
//   },
//   {
//     city: "匈牙利",
//     code: "+36",
//   },
//   {
//     city: "冰岛",
//     code: "+354",
//   },
//   {
//     city: "印度",
//     code: "+91",
//   },
//   {
//     city: "印度尼西亚",
//     code: "+62",
//   },
//   {
//     city: "伊朗",
//     code: "+98",
//   },
//   {
//     city: "伊拉克",
//     code: "+964",
//   },
//   {
//     city: "爱尔兰",
//     code: "+353",
//   },
//   {
//     city: "马恩岛",
//     code: "+44",
//   },
//   {
//     city: "以色列",
//     code: "+972",
//   },
//   {
//     city: "意大利",
//     code: "+93",
//   },
//   {
//     city: "牙买加",
//     code: "+1876",
//   },
//   {
//     city: "日本",
//     code: "+81",
//   },
//   {
//     city: "泽西岛",
//     code: "+44",
//   },
//   {
//     city: "约旦",
//     code: "+962",
//   },
//   {
//     city: "哈萨克斯坦",
//     code: "+7",
//   },
//   {
//     city: "肯尼亚",
//     code: "+254",
//   },
//   {
//     city: "科索沃",
//     code: "+383",
//   },
//   {
//     city: "科威特",
//     code: "+965",
//   },
//   {
//     city: "吉尔吉斯斯坦",
//     code: "+996",
//   },
//   {
//     city: "老挝",
//     code: "+856",
//   },
//   {
//     city: "拉脱维亚",
//     code: "+371",
//   },
//   {
//     city: "黎巴嫩",
//     code: "+961",
//   },
//   {
//     city: "莱索托",
//     code: "+266",
//   },
//   {
//     city: "利比里亚",
//     code: "+231",
//   },
//   {
//     city: "利比亚",
//     code: "+218",
//   },
//   {
//     city: "列支敦士登",
//     code: "+423",
//   },
//   {
//     city: "立陶宛",
//     code: "+370",
//   },
//   {
//     city: "卢森堡",
//     code: "+352",
//   },
//   {
//     city: "马其顿",
//     code: "+389",
//   },
//   {
//     city: "马达加斯加",
//     code: "+261",
//   },
//   {
//     city: "马拉维",
//     code: "+265",
//   },
//   {
//     city: "马来西亚",
//     code: "+60",
//   },
//   {
//     city: "马尔代夫",
//     code: "+960",
//   },
//   {
//     city: "马里",
//     code: "+223",
//   },
//   {
//     city: "马耳他",
//     code: "+356",
//   },
//   {
//     city: "马提尼克",
//     code: "+596",
//   },
//   {
//     city: "毛里塔尼亚",
//     code: "+222",
//   },
//   {
//     city: "毛里求斯",
//     code: "+230",
//   },
//   {
//     city: "马约特",
//     code: "+262",
//   },
//   {
//     city: "墨西哥",
//     code: "+52",
//   },
//   {
//     city: "摩尔多瓦",
//     code: "+373",
//   },
//   {
//     city: "摩纳哥",
//     code: "+377",
//   },
//   {
//     city: "蒙古",
//     code: "+976",
//   },
//   {
//     city: "黑山",
//     code: "+382",
//   },
//   {
//     city: "蒙特塞拉特",
//     code: "+1664",
//   },
//   {
//     city: "摩洛哥",
//     code: "+212",
//   },
//   {
//     city: "莫桑比克",
//     code: "+258",
//   },
//   {
//     city: "纳米比亚",
//     code: "+264",
//   },
//   {
//     city: "尼泊尔",
//     code: "+977",
//   },
//   {
//     city: "荷兰",
//     code: "+31",
//   },
//   {
//     city: "荷属安的列斯",
//     code: "+599",
//   },
//   {
//     city: "新喀里多尼亚",
//     code: "+687",
//   },
//   {
//     city: "新西兰",
//     code: "+64",
//   },
//   {
//     city: "尼加拉瓜",
//     code: "+505",
//   },
//   {
//     city: "尼日尔",
//     code: "+227",
//   },
//   {
//     city: "尼日利亚",
//     code: "+234",
//   },
//   {
//     city: "挪威",
//     code: "+47",
//   },
//   {
//     city: "阿曼",
//     code: "+968",
//   },
//   {
//     city: "巴基斯坦",
//     code: "+92",
//   },
//   {
//     city: "巴勒斯坦",
//     code: "+970",
//   },
//   {
//     city: "巴拿马",
//     code: "+507",
//   },
//   {
//     city: "巴布亚新几内亚",
//     code: "+675",
//   },
//   {
//     city: "巴拉圭",
//     code: "+595",
//   },
//   {
//     city: "秘鲁",
//     code: "+51",
//   },
//   {
//     city: "菲律宾",
//     code: "+63",
//   },
//   {
//     city: "波兰",
//     code: "+48",
//   },
//   {
//     city: "葡萄牙",
//     code: "+351",
//   },
//   {
//     city: "波多黎各",
//     code: "+1",
//   },
//   {
//     city: "库塔",
//     code: "+974",
//   },
//   {
//     city: "留尼汪",
//     code: "+262",
//   },
//   {
//     city: "罗马尼亚",
//     code: "+40",
//   },
//   {
//     city: "俄罗斯",
//     code: "+7",
//   },
//   {
//     city: "卢旺达",
//     code: "+250",
//   },
//   {
//     city: "萨摩亚东部",
//     code: "+684",
//   },
//   {
//     city: "萨摩亚西部",
//     code: "+685",
//   },
//   {
//     city: "圣马力诺",
//     code: "+378",
//   },
//   {
//     city: "圣多美和普林西比",
//     code: "+239",
//   },
//   {
//     city: "沙特阿拉伯",
//     code: "+966",
//   },
//   {
//     city: "塞内加尔",
//     code: "+221",
//   },
//   {
//     city: "塞尔维亚",
//     code: "+381",
//   },
//   {
//     city: "塞舌尔",
//     code: "+248",
//   },
//   {
//     city: "塞拉利昂",
//     code: "+232",
//   },
//   {
//     city: "斯洛伐克",
//     code: "+421",
//   },
//   {
//     city: "斯洛文尼亚",
//     code: "+386",
//   },
//   {
//     city: "南非",
//     code: "+27",
//   },
//   {
//     city: "韩国",
//     code: "+82",
//   },
//   {
//     city: "西班牙",
//     code: "+34",
//   },
//   {
//     city: "斯里兰卡",
//     code: "+94",
//   },
//   {
//     city: "圣基茨和尼维斯",
//     code: "+1869",
//   },
//   {
//     city: "圣卢西亚",
//     code: "+1758",
//   },
//   {
//     city: "圣文森特",
//     code: "+1784",
//   },
//   {
//     city: "苏丹",
//     code: "+249",
//   },
//   {
//     city: "苏里南",
//     code: "+597",
//   },
//   {
//     city: "斯威士兰",
//     code: "+268",
//   },
//   {
//     city: "瑞典",
//     code: "+46",
//   },
//   {
//     city: "瑞士",
//     code: "+41",
//   },
//   {
//     city: "叙利亚",
//     code: "+963",
//   },
//   {
//     city: "塔吉克斯坦",
//     code: "+992",
//   },
//   {
//     city: "坦桑尼亚",
//     code: "+255",
//   },
//   {
//     city: "泰国",
//     code: "+66",
//   },
//   {
//     city: "东帝汶",
//     code: "+670",
//   },
//   {
//     city: "多哥",
//     code: "+228",
//   },
//   {
//     city: "汤加",
//     code: "+676",
//   },
//   {
//     city: "特立尼达和多巴哥",
//     code: "+1868",
//   },
//   {
//     city: "突尼斯",
//     code: "+216",
//   },
//   {
//     city: "土耳其",
//     code: "+90",
//   },
//   {
//     city: "土库曼斯坦",
//     code: "+993",
//   },
//   {
//     city: "特克斯和凯科斯群岛",
//     code: "+1649",
//   },
//   {
//     city: "乌干达",
//     code: "+256",
//   },
//   {
//     city: "乌克兰",
//     code: "+380",
//   },
//   {
//     city: "阿拉伯联合酋长国",
//     code: "+971",
//   },
//   {
//     city: "英国",
//     code: "+44",
//   },
//   {
//     city: "美国",
//     code: "+1",
//   },
//   {
//     city: "乌拉圭",
//     code: "+598",
//   },
//   {
//     city: "乌兹别克斯坦",
//     code: "+998",
//   },
//   {
//     city: "瓦努阿图",
//     code: "+678",
//   },
//   {
//     city: "委内瑞拉",
//     code: "+58",
//   },
//   {
//     city: "越南",
//     code: "+84",
//   },
//   {
//     city: "维尔京群岛",
//     code: "+1340",
//   },
//   {
//     city: "也门",
//     code: "+967",
//   },
//   {
//     city: "赞比亚",
//     code: "+260",
//   },
//   {
//     city: "津巴布韦",
//     code: "+263",
//   },
// ];

export const phonePrefixData = [
  {
    city: "Mainland China",
    code: "+86",
  },
  {
    city: "Hong Kong, China",
    code: "+852",
  },
  {
    city: "Macau, China",
    code: "+853",
  },
  {
    city: "Taiwan, China",
    code: "+886",
  },
  {
    city: "Singapore",
    code: "+65",
  },
  {
    city: "Afghanistan",
    code: "+93",
  },
  {
    city: "Albania",
    code: "+355",
  },
  {
    city: "Algra",
    code: "+213",
  },
  {
    city: "Andorra",
    code: "+376",
  },
  {
    city: "Angola",
    code: "+244",
  },
  {
    city: "Anguilla",
    code: "+1264",
  },
  {
    city: "Ascension Island",
    code: "+247",
  },
  {
    city: "Antigua and Barbuda",
    code: "+1268",
  },
  {
    city: "Argentina",
    code: "+54",
  },
  {
    city: "Armenia",
    code: "+374",
  },
  {
    city: "Aruba",
    code: "+297",
  },
  {
    city: "Australia",
    code: "+61",
  },
  {
    city: "Austria",
    code: "+43",
  },
  {
    city: "Azerbaijan",
    code: "+994",
  },
  {
    city: "Bahamas",
    code: "+1242",
  },
  {
    city: "Bahrain",
    code: "+973",
  },
  {
    city: "Bangladesh",
    code: "+880",
  },
  {
    city: "Barbados",
    code: "+1246",
  },
  {
    city: "Belarus",
    code: "+375",
  },
  {
    city: "Belgium",
    code: "+32",
  },
  {
    city: "Belize",
    code: "+501",
  },
  {
    city: "Benin",
    code: "+229",
  },
  {
    city: "Bermuda",
    code: "+1441",
  },
  {
    city: "Bhutan",
    code: "+975",
  },
  {
    city: "Bolivia",
    code: "+591",
  },
  {
    city: "Bosnia and Herzegovina",
    code: "+387",
  },
  {
    city: "Botswana",
    code: "+267",
  },
  {
    city: "Brazil",
    code: "+55",
  },
  {
    city: "Brunei",
    code: "+673",
  },
  {
    city: "Bulgaria",
    code: "+359",
  },
  {
    city: "Burkina Faso",
    code: "+226",
  },
  {
    city: "Burundi",
    code: "+257",
  },
  {
    city: "Cambodia",
    code: "+855",
  },
  {
    city: "Cameroon",
    code: "+237",
  },
  {
    city: "Canada",
    code: "+1",
  },
  {
    city: "Cape Verde",
    code: "+238",
  },
  {
    city: "Cayman Islands",
    code: "+1345",
  },
  {
    city: "Central African Republic",
    code: "+236",
  },
  {
    city: "Chad",
    code: "+235",
  },
  {
    city: "Chile",
    code: "+56",
  },
  {
    city: "Colombia",
    code: "+57",
  },
  {
    city: "Comoros",
    code: "+269",
  },
  {
    city: "Republic of the Congo",
    code: "+242",
  },
  {
    city: "Democratic Republic of the Congo",
    code: "+243",
  },
  {
    city: "Cook Islands",
    code: "+682",
  },
  {
    city: "Costa Rica",
    code: "+506",
  },
  {
    city: "Côte d'Ivoire",
    code: "+225",
  },
  {
    city: "Croatia",
    code: "+385",
  },
  {
    city: "Cuba",
    code: "+53",
  },
  {
    city: "Cyprus",
    code: "+357",
  },
  {
    city: "+Czech Republic",
    code: "+420",
  },
  {
    city: "Denmark",
    code: "+45",
  },
  {
    city: "Djibouti",
    code: "+253",
  },
  {
    city: "Dominica",
    code: "+1767",
  },
  {
    city: "Dominican Republic",
    code: "+1809",
  },
  {
    city: "Ecuador",
    code: "+593",
  },
  {
    city: "Egypt",
    code: "+20",
  },
  {
    city: "El Salvador",
    code: "+503",
  },
  {
    city: "Estonia",
    code: "+372",
  },
  {
    city: "Ethiopia",
    code: "+251",
  },
  {
    city: "Faroe Islands",
    code: "+298",
  },
  {
    city: "Fiji",
    code: "+679",
  },
  {
    city: "Finland",
    code: "+358",
  },
  {
    city: "France",
    code: "+33",
  },
  {
    city: "French Guiana",
    code: "+594",
  },
  {
    city: "French Polynesia",
    code: "+689",
  },
  {
    city: "Gabon",
    code: "+241",
  },
  {
    city: "Gambia",
    code: "+220",
  },
  {
    city: "Georgia",
    code: "+995",
  },
  {
    city: "Germany",
    code: "+94",
  },
  {
    city: "Ghana",
    code: "+233",
  },
  {
    city: "Gibraltar",
    code: "+350",
  },
  {
    city: "Greece",
    code: "+30",
  },
  {
    city: "Greenland",
    code: "+299",
  },
  {
    city: "Grenada",
    code: "+1473",
  },
  {
    city: "Guadeloupe",
    code: "+590",
  },
  {
    city: "Guam",
    code: "+1671",
  },
  {
    city: "Guatemala",
    code: "+502",
  },
  {
    city: "Guinea",
    code: "+240",
  },
  {
    city: "Guernsey",
    code: "+44",
  },
  {
    city: "Guinea",
    code: "+224",
  },
  {
    city: "Guyana",
    code: "+592",
  },
  {
    city: "Haiti",
    code: "+509",
  },
  {
    city: "Honduras",
    code: "+504",
  },
  {
    city: "Myanmar",
    code: "+95",
  },
  {
    city: "Hungary",
    code: "+36",
  },
  {
    city: "Iceland",
    code: "+354",
  },
  {
    city: "India",
    code: "+91",
  },
  {
    city: "Indonesia",
    code: "+62",
  },
  {
    city: "Iran",
    code: "+98",
  },
  {
    city: "Iraq",
    code: "+964",
  },
  {
    city: "Ireland",
    code: "+353",
  },
  {
    city: "Isle of Man",
    code: "+44",
  },
  {
    city: "Israel",
    code: "+972",
  },
  {
    city: "Italy",
    code: "+93",
  },
  {
    city: "Jamaica",
    code: "+1876",
  },
  {
    city: "Japan",
    code: "+81",
  },
  {
    city: "Jersey",
    code: "+44",
  },
  {
    city: "Jordan",
    code: "+962",
  },
  {
    city: "Kazakhstan",
    code: "+7",
  },
  {
    city: "Kenya",
    code: "+254",
  },
  {
    city: "Kosovo",
    code: "+383",
  },
  {
    city: "Kuwait",
    code: "+965",
  },
  {
    city: "Kyrgyzstan",
    code: "+996",
  },
  {
    city: "Laos",
    code: "+856",
  },
  {
    city: "Latvia",
    code: "+371",
  },
  {
    city: "Lebanon",
    code: "+961",
  },
  {
    city: "Lesotho",
    code: "+266",
  },
  {
    city: "Liberia",
    code: "+231",
  },
  {
    city: "Libya",
    code: "+218",
  },
  {
    city: "Liechtenstein",
    code: "+423",
  },
  {
    city: "Lithuania",
    code: "+370",
  },
  {
    city: "Luxembourg",
    code: "+352",
  },
  {
    city: "Macedonia",
    code: "+389",
  },
  {
    city: "Madagascar",
    code: "+261",
  },
  {
    city: "Malawi",
    code: "+265",
  },
  {
    city: "Malaysia",
    code: "+60",
  },
  {
    city: "Maldives",
    code: "+960",
  },
  {
    city: "Mali",
    code: "+223",
  },
  {
    city: "Malta",
    code: "+356",
  },
  {
    city: "Martinique",
    code: "+596",
  },
  {
    city: "Mauritania",
    code: "+222",
  },
  {
    city: "Mauritius",
    code: "+230",
  },
  {
    city: "Mayotte",
    code: "+262",
  },
  {
    city: "Mexico",
    code: "+52",
  },
  {
    city: "Moldova",
    code: "+373",
  },
  {
    city: "Monaco",
    code: "+377",
  },
  {
    city: "Mongolia",
    code: "+976",
  },
  {
    city: "Montenegro",
    code: "+382",
  },
  {
    city: "Montserrat",
    code: "+1664",
  },
  {
    city: "Morocco",
    code: "+212",
  },
  {
    city: "Mozambique",
    code: "+258",
  },
  {
    city: "Namibia",
    code: "+264",
  },
  {
    city: "Nepal",
    code: "+977",
  },
  {
    city: "Netherlands",
    code: "+31",
  },
  {
    city: "Netherlands Antilles",
    code: "+599",
  },
  {
    city: "New Caledonia",
    code: "+687",
  },
  {
    city: "New Zealand",
    code: "+64",
  },
  {
    city: "Nicaragua",
    code: "+505",
  },
  {
    city: "Niger",
    code: "+227",
  },
  {
    city: "Nigeria",
    code: "+234",
  },
  {
    city: "Norway",
    code: "+47",
  },
  {
    city: "Oman",
    code: "+968",
  },
  {
    city: "Pakistan",
    code: "+92",
  },
  {
    city: "Palestine",
    code: "+970",
  },
  {
    city: "Panama",
    code: "+507",
  },
  {
    city: "Papua New Guinea",
    code: "+675",
  },
  {
    city: "Paraguay",
    code: "+595",
  },
  {
    city: "Peru",
    code: "+51",
  },
  {
    city: "Philippines",
    code: "+63",
  },
  {
    city: "Poland",
    code: "+48",
  },
  {
    city: "Portugal",
    code: "+351",
  },
  {
    city: "Puerto Rico",
    code: "+1",
  },
  {
    city: "Kuta",
    code: "+974",
  },
  {
    city: "Reunion",
    code: "+262",
  },
  {
    city: "Romania",
    code: "+40",
  },
  {
    city: "Russia",
    code: "+7",
  },
  {
    city: "Rwanda",
    code: "+250",
  },
  {
    city: "Eastern Samoa",
    code: "+684",
  },
  {
    city: "Western Samoa",
    code: "+685",
  },
  {
    city: "San Marino",
    code: "+378",
  },
  {
    city: "Sao Tome and Principe",
    code: "+239",
  },
  {
    city: "Saudi Arabia",
    code: "+966",
  },
  {
    city: "Senegal",
    code: "+221",
  },
  {
    city: "Serbia",
    code: "+381",
  },
  {
    city: "Seychelles",
    code: "+248",
  },
  {
    city: "Sierra Leone",
    code: "+232",
  },
  {
    city: "Slovakia",
    code: "+421",
  },
  {
    city: "Slovenia",
    code: "+386",
  },
  {
    city: "South Africa",
    code: "+27",
  },
  {
    city: "South Korea",
    code: "+82",
  },
  {
    city: "Spain",
    code: "+34",
  },
  {
    city: "Sri Lanka",
    code: "+94",
  },
  {
    city: "Saint Kitts and Nevis",
    code: "+1869",
  },
  {
    city: "Saint Lucia",
    code: "+1758",
  },
  {
    city: "Saint Vincent",
    code: "+1784",
  },
  {
    city: "Sudan",
    code: "+249",
  },
  {
    city: "Suriname",
    code: "+597",
  },
  {
    city: "Swaziland",
    code: "+268",
  },
  {
    city: "Sweden",
    code: "+46",
  },
  {
    city: "Switzerland",
    code: "+41",
  },
  {
    city: "Syria",
    code: "+963",
  },
  {
    city: "Tajikistan",
    code: "+992",
  },
  {
    city: "Tanzania",
    code: "+255",
  },
  {
    city: "Thailand",
    code: "+66",
  },
  {
    city: "East Timor",
    code: "+670",
  },
  {
    city: "Togo",
    code: "+228",
  },
  {
    city: "Tonga",
    code: "+676",
  },
  {
    city: "Trinidad and Tobago",
    code: "+1868",
  },
  {
    city: "Tunisia",
    code: "+216",
  },
  {
    city: "Türkiye",
    code: "+90",
  },
  {
    city: "Turkmenistan",
    code: "+993",
  },
  {
    city: "Turks and Caicos Islands",
    code: "+1649",
  },
  {
    city: "Uganda",
    code: "+256",
  },
  {
    city: "Ukraine",
    code: "+380",
  },
  {
    city: "United Arab Emirates",
    code: "+971",
  },
  {
    city: "United Kingdom",
    code: "+44",
  },
  {
    city: "United States",
    code: "+1",
  },
  {
    city: "Uruguay",
    code: "+598",
  },
  {
    city: "Uzbekistan",
    code: "+998",
  },
  {
    city: "Vanuatu",
    code: "+678",
  },
  {
    city: "Venezuela",
    code: "+58",
  },
  {
    city: "Vietnam",
    code: "+84",
  },
  {
    city: "Virgin Islands",
    code: "+1340",
  },
  {
    city: "Yemen",
    code: "+967",
  },
  {
    city: "Zambia",
    code: "+260",
  },
  {
    city: "Zimbabwe",
    code: "+263",
  },
];

export const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    if (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    ) {
      return true;
    }
    return false;
  },
};

export const removeCookies = () => {
  if (sceneConfig[window.location.hostname]) {
    Cookies.remove("user_info", {
      domain: ".wdabuliu.com",
    });
    Cookies.remove("token", {
      domain: ".wdabuliu.com",
    });
    Cookies.remove("scene_instance_response", {
      domain: ".wdabuliu.com",
    });
  }
};

export function dataURLtoBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(",");
  const typeItem = arr[0];
  const mime = typeItem.match(/:(.*?);/)![1];
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
