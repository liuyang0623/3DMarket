interface ItemProps {
  type: number; //跳转类型 1:个人空间 2:换装
  instanceId?: string; // 个人空间跳转id
  name: string;
}
interface ConfigProps {
  [key: string]: ItemProps;
}
export const sceneConfig: ConfigProps = {
  /** SpaceU广场 */
  "spaceuplaza.wdabuliu.com": {
    type: 1,
    instanceId: "11413275178205189",
    name: "spaceuplaza",
  },
  // /** SpaceU路演 */
  // "spaceuroadshow.wdabuliu.com": {
  //   type: 1,
  //   instanceId: "11410101508800517",
  //   name: "spaceuroadshow",
  // },
  /** 耘公馆 */
  "yunhaus.wdabuliu.com": {
    type: 1,
    instanceId: "1149782758969180165",
    name: "yunhaus",
  },
  /** 运淼 */
  "yunmiao.wdabuliu.com": {
    type: 1,
    instanceId: "1149650689224736773",
    name: "yunmiao",
  },
  /** 喜力啤酒 */
  "heineken.wdabuliu.com": {
    type: 1,
    instanceId: "1149624083318439941",
    name: "heineken",
  },
  /** 在线大学 */
  "onlineedu.wdabuliu.com": {
    type: 1,
    instanceId: "11410099851001861",
    name: "onlineedu",
  },
  /** 夏日风情 */
  "summerholidays.wdabuliu.com": {
    type: 1,
    instanceId: "11411117090832389",
    name: "summerholidays",
  },
  /** 中国移动 */
  "chinamobile.wdabuliu.com": {
    type: 1,
    instanceId: "11410305865252869",
    name: "chinamobile",
  },
  // /** 生活在别处 */
  // "lifestyle.wdabuliu.com": {
  //   type: 1,
  //   instanceId: "11410355293028357",
  //   name: "lifestyle",
  // },
  /** 九竹 */
  "bamboo.wdabuliu.com": {
    type: 1,
    instanceId: "11410801601052677",
    name: "bamboo",
  },
  /** mitaacademy */
  "mitaacademy.wdabuliu.com": {
    type: 1,
    instanceId: "11410099851001861",
    name: "mitaacademy",
  },
  /** 复古艺术 */
  "retroart.wdabuliu.com": {
    type: 1,
    instanceId: "11414069407416325",
    name: "retroart",
  },
  /** 青年艺术 */
  "youthart.wdabuliu.com": {
    type: 1,
    instanceId: "11413453799194629",
    name: "youthart",
  },
  /** XploreTech展览 */
  "xplore.wdabuliu.com": {
    type: 1,
    instanceId: "11412635267137541",
    name: "xplore",
  },
  /** 换装 */
  "character.wdabuliu.com": {
    type: 2,
    instanceId: "",
    name: "character",
  },
};
