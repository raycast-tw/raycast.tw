export interface GuideScript {
  npcId: string;
  name: string;
  role: string;
  color: string;
  lines: string[];
}

export const guideScripts = new Map<string, GuideScript>([
  [
    "thomas",
    {
      npcId: "thomas",
      name: "Thomas Paul Mann",
      role: "共同創辦人暨執行長",
      color: "#ffbc33",
      lines: [
        "歡迎來到 Raycast 迷宮！我是 Thomas，共同創辦人之一。",
        "每個發光點都代表一項功能，走進去就能了解它能做什麼。",
        "建議從左側基本功開始：搜尋列、快捷鍵、剪貼簿紀錄與程式碼片段。",
        "Pedro 在迷宮深處，會帶你看進階功能。祝探索愉快！",
      ],
    },
  ],
  [
    "pedro",
    {
      npcId: "pedro",
      name: "Pedro Duarte",
      role: "Hype Team",
      color: "#55b3ff",
      lines: [
        "嗨！我是 Pedro，你已經來到進階區了。",
        "Store 裡有超過兩千個外掛，而且全部都是開源的 React 與 TypeScript。",
        "AI 直接內建在指令列，試試摘要、翻譯或寫程式。",
        "找齊所有功能，你就是 Raycast 高手了。繼續探索吧！",
      ],
    },
  ],
]);
