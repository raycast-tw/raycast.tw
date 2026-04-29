const htmlFiles = import.meta.glob<string>("./*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});

function html(id: string): string {
  return htmlFiles[`./${id}.html`] ?? "";
}

export interface Newsletter {
  id: string;
  title: string;
  date: string;
  type: "monthly" | "weekly";
  theme: "crimson" | "indigo" | "emerald" | "violet" | "amber";
  kicker: string;
  summary: string;
  content: string;
  author: string;
  episode?: string;
}

export const newsletters: Newsletter[] = [
  {
    id: "monthly-2026-02",
    title: "Raycast 二月月報：Introducing Glaze、新版 Raycast 時程與更多更新",
    date: "2026-03-06",
    type: "monthly",
    theme: "emerald",
    kicker: "Raycast February Update",
    summary:
      "Pedro 公布 Glaze、分享新版 Raycast 的預計時程，並整理 Windows、iOS 與社群活動的最新進展。",
    author: "Raycast Team",
    content: html("monthly-2026-02"),
  },
  {
    id: "monthly-2026-01",
    title: "Raycast 一月月報：Typing Practice、Chat Branching 與 Team Picks",
    date: "2026-02-04",
    type: "monthly",
    theme: "violet",
    kicker: "Raycast January Update",
    summary:
      "2026 第一封月報聚焦 Windows 的 Typing Practice 與 AI Commands，以及 iOS 的 Chat Branching、Disposable Chats 與社群消息。",
    author: "Raycast Team",
    content: html("monthly-2026-01"),
  },
  {
    id: "monthly-2026-03",
    title: "Raycast 三月月報：美國活動、Windows 與 iOS 更新、Glaze Sessions",
    date: "2026-04-13",
    type: "monthly",
    theme: "crimson",
    kicker: "Raycast March Update",
    summary:
      "Pedro 帶來三月更新，涵蓋 Raycast for Windows 與 iOS 的新功能、Glaze Sessions 的社群動態，以及 Raycast 首次在美國舉辦的官方活動。",
    author: "Raycast Team",
    content: html("monthly-2026-03"),
  },
  {
    id: "weekly-2026-rw001",
    title: "Raycast Weekly RW001：首期週報、Glaze 與 iOS 背景聊天",
    date: "2026-03-14",
    type: "weekly",
    theme: "crimson",
    kicker: "Raycast Weekly",
    summary:
      "首期週報聚焦 Glaze 發表、Raycast iOS 背景聊天、Watercooler #2 與一批新上架擴充，也整理了三月下旬到四月的社群活動。",
    author: "Alexi | Raycast Weekly",
    episode: "RW001",
    content: html("weekly-2026-rw001"),
  },
  {
    id: "weekly-2026-rw002",
    title: "Raycast Weekly RW002：專屬 Extension、Grok 4.20 與平台更新",
    date: "2026-03-21",
    type: "weekly",
    theme: "violet",
    kicker: "Raycast Weekly",
    summary:
      "第二期週報整理 Raycast Weekly 專屬 extension、Grok 4.20、iOS 與 Windows 新功能，以及新一批上架到 Store 的社群擴充。",
    author: "Alexi | Raycast Weekly",
    episode: "RW002",
    content: html("weekly-2026-rw002"),
  },
  {
    id: "weekly-2026-rw003",
    title: "Raycast Weekly RW003：Windows 虛擬桌面、Codex 主題與 Glaze 作品",
    date: "2026-04-10",
    type: "weekly",
    theme: "emerald",
    kicker: "Raycast Weekly",
    summary:
      "本期聚焦 Windows 虛擬桌面指令、Codex 相關主題與 Glaze 社群作品，也收錄了紐約活動動態與 24 個新上架擴充。",
    author: "Alexi | Raycast Weekly",
    episode: "RW003",
    content: html("weekly-2026-rw003"),
  },
  {
    id: "weekly-2026-rw004",
    title: "Raycast Weekly RW004：iOS Calculator、Watercooler #3 與本地模型",
    date: "2026-04-16",
    type: "weekly",
    theme: "amber",
    kicker: "Raycast Weekly",
    summary:
      "第四期週報帶來 iOS Calculator、Watercooler #3、Raycast 2.0 與本地模型話題，並整理近期活動與一批新的 Store 擴充。",
    author: "Alexi | Raycast Weekly",
    episode: "RW004",
    content: html("weekly-2026-rw004"),
  },
  {
    id: "weekly-2026-rw005",
    title: "Raycast Weekly RW005：Hyperkey、Glaze 作品與活動速報",
    date: "2026-04-21",
    type: "weekly",
    theme: "indigo",
    kicker: "Raycast Weekly",
    summary:
      "本期整理 Raycast for Windows 的 Hyperkey 更新、Glaze 社群作品、近期活動與新上架擴充，也收錄了 Raycast Maze 被提及的亮點。",
    author: "Alexi | Raycast Weekly",
    episode: "RW005",
    content: html("weekly-2026-rw005"),
  },
  {
    id: "weekly-2026-rw006",
    title:
      "Raycast Weekly RW006：新版 Raycast rollout、GPT-5.5 與 Theme Studio",
    date: "2026-04-28",
    type: "weekly",
    theme: "violet",
    kicker: "Raycast Weekly",
    summary:
      "第六期週報整理新版 Raycast rollout、GPT-5.5、Windows Theme Studio、Glaze 社群作品與五月中旬前的活動動態。",
    author: "Alexi | Raycast Weekly",
    episode: "RW006",
    content: html("weekly-2026-rw006"),
  },
];
