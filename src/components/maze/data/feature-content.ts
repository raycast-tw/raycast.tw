import type { LucideIcon } from "lucide-react";
import iconSearchBar from "../../../assets/icons/search-bar.png";
import iconHotkey from "../../../assets/icons/hotkey.png";
import iconClipboard from "../../../assets/icons/clipboard.png";
import iconSnippets from "../../../assets/icons/snippets.png";
import iconQuicklinks from "../../../assets/icons/quicklinks.png";
import iconWindowMgmt from "../../../assets/icons/window-mgmt.png";
import iconCalculator from "../../../assets/icons/calculator.png";
import iconCalendar from "../../../assets/icons/calendar.png";
import iconFileSearch from "../../../assets/icons/file-search.png";
import iconStore from "../../../assets/icons/store.png";
import iconAI from "../../../assets/icons/ai.png";
import iconNotes from "../../../assets/icons/notes.png";
import iconFocus from "../../../assets/icons/focus.png";
import iconSystem from "../../../assets/icons/system.png";
import {
  Search,
  Keyboard,
  ClipboardList,
  TextCursorInput,
  Link,
  AppWindow,
  Calculator,
  CalendarDays,
  FileSearch,
  Store,
  Sparkles,
  StickyNote,
  EyeOff,
  Terminal,
} from "lucide-react";

export interface FeatureInfo {
  id: string;
  name: string;
  icon: LucideIcon;
  iconUrl: string;
  color: string;
  tagline: string;
  description: string;
  shortcuts: { keys: string[]; description: string }[];
  tip: string;
}

export const features = new Map<string, FeatureInfo>([
  [
    "search-bar",
    {
      id: "search-bar",
      name: "搜尋列",
      icon: Search,
      iconUrl: iconSearchBar,
      color: "#FF6363",
      tagline: "一切的起點：指令、檔案與 App，一次搜尋。",
      description:
        "Raycast 指令列用快捷鍵喚出，可啟動 App、執行指令、搜尋檔案。隨打隨找，支援模糊比對——所有操作都從這裡開始。",
      shortcuts: [
        { keys: ["Option", "Space"], description: "開啟 Raycast" },
        { keys: ["Esc"], description: "關閉" },
      ],
      tip: "可只打部分名稱，Raycast 會用模糊比對找到指令，打錯字也常有救。",
    },
  ],
  [
    "hotkey",
    {
      id: "hotkey",
      name: "快捷鍵",
      icon: Keyboard,
      iconUrl: iconHotkey,
      color: "#FF6363",
      tagline: "不必打字，一按就執行常用指令。",
      description:
        "為任何 Raycast 指令指定全域快捷鍵，按下立即執行，不必經過搜尋列。最適合每天重複無數次的動作。",
      shortcuts: [
        { keys: ["Cmd", "K"], description: "開啟動作面板" },
        { keys: ["Record Hotkey"], description: "在設定中指定" },
      ],
      tip: "為最常用的 5 個指令設快捷鍵，速度會差非常多。",
    },
  ],
  [
    "clipboard",
    {
      id: "clipboard",
      name: "剪貼簿紀錄",
      icon: ClipboardList,
      iconUrl: iconClipboard,
      color: "#55b3ff",
      tagline: "複製過的內容都在這裡，可搜尋、可釘選。",
      description:
        "剪貼簿紀錄保存文字、圖片、連結等，支援搜尋、釘選與篩選，資料在本地加密儲存。再也不怕複製後找不到。",
      shortcuts: [
        { keys: ["Cmd", "Shift", "V"], description: "開啟剪貼簿（可自訂）" },
        { keys: ["Cmd", "Shift", "P"], description: "釘選項目" },
        { keys: ["Ctrl", "X"], description: "移除項目" },
      ],
      tip: "常用品釘選起來，就會固定排在列表上方。",
    },
  ],
  [
    "snippets",
    {
      id: "snippets",
      name: "程式碼片段",
      icon: TextCursorInput,
      iconUrl: iconSnippets,
      color: "#55b3ff",
      tagline: "關鍵字展開成全文，還能動態帶入內容。",
      description:
        "在任何可輸入處用關鍵字展開預設文字。支援 {date}、{clipboard}、{cursor} 等占位符，插入後游標也能精準落點。",
      shortcuts: [
        { keys: ["輸入關鍵字"], description: "自動展開片段" },
        { keys: ["{date}"], description: "插入今天日期" },
        { keys: ["{clipboard}"], description: "貼上剪貼簿" },
      ],
      tip: "用 {cursor} 指定展開後游標要停在哪，長段落特別好用。",
    },
  ],
  [
    "quicklinks",
    {
      id: "quicklinks",
      name: "快速連結",
      icon: Link,
      iconUrl: iconQuicklinks,
      color: "#5fc992",
      tagline: "打名稱就開網址，常用工具一鍵到達。",
      description:
        "自訂網址捷徑與查詢參數。在 Raycast 輸入快速連結名稱即可開啟網頁、儀表板或內部工具；可用 {query} 帶入動態關鍵字。",
      shortcuts: [
        { keys: ["輸入快速連結名稱"], description: "開啟網址" },
        { keys: ["{query}"], description: "動態查詢參數" },
      ],
      tip: "公司儀表板、文件站、內網工具都很適合做成快速連結。",
    },
  ],
  [
    "window-mgmt",
    {
      id: "window-mgmt",
      name: "視窗管理",
      icon: AppWindow,
      iconUrl: iconWindowMgmt,
      color: "#5fc992",
      tagline: "不靠滑鼠，鍵盤排好視窗位置與大小。",
      description:
        "用指令快速靠左靠右、最大化、置中、三等分等版面。任何 App 裡都能叫出，整理桌面超順。",
      shortcuts: [
        { keys: ["Ctrl", "Opt", "←/→"], description: "左右半屏" },
        { keys: ["Ctrl", "Opt", "Enter"], description: "最大化" },
        { keys: ["Ctrl", "Opt", "C"], description: "置中" },
      ],
      tip: "搭配多個桌面空間，鍵盤排窗＋切桌面，專注力更好。",
    },
  ],
  [
    "calculator",
    {
      id: "calculator",
      name: "計算機",
      icon: Calculator,
      iconUrl: iconCalculator,
      color: "#ffbc33",
      tagline: "算式、單位換算與時區，直接在列上完成。",
      description:
        "在 Raycast 輸入算式即時得到結果。支援單位換算、匯率、時區計算、百分比與較長的運算式，不必另開計算機 App。",
      shortcuts: [
        { keys: ["輸入算式"], description: "即時顯示結果" },
        { keys: ["5kg in lbs"], description: "單位換算範例" },
        { keys: ["Enter"], description: "複製結果到剪貼簿" },
      ],
      tip: "也支援「今天 + 30 天」這類日期計算。",
    },
  ],
  [
    "calendar",
    {
      id: "calendar",
      name: "行事曆",
      icon: CalendarDays,
      iconUrl: iconCalendar,
      color: "#ffbc33",
      tagline: "行程與會議連結，不必切到行事曆 App。",
      description:
        "整合行事曆後，可在 Raycast 查看接下來的行程、加入視訊連結、瀏覽活動細節。支援 Google 與 Apple 行事曆。",
      shortcuts: [
        { keys: ["輸入 schedule"], description: "查看即將到來的活動" },
        { keys: ["Enter"], description: "開啟或加入會議" },
        { keys: ["Cmd", "D"], description: "顯示日期詳情" },
      ],
      tip: "Google 與 Apple 行事曆可同時使用。",
    },
  ],
  [
    "file-search",
    {
      id: "file-search",
      name: "檔案搜尋",
      icon: FileSearch,
      iconUrl: iconFileSearch,
      color: "#55b3ff",
      tagline: "用自然語言找檔案，結果即時列出。",
      description:
        "依檔名、類型或位置搜尋檔案，結果可立即開啟、在 Finder 顯示或複製路徑。",
      shortcuts: [
        { keys: ["輸入檔名"], description: "搜尋檔案" },
        { keys: ["Cmd", "Enter"], description: "在 Finder 顯示" },
        { keys: ["Cmd", "Shift", ","], description: "複製路徑" },
      ],
      tip: "試試「桌面上的 .txt」或「上週的圖片」這類說法。",
    },
  ],
  [
    "store",
    {
      id: "store",
      name: "Store",
      icon: Store,
      iconUrl: iconStore,
      color: "#FF6363",
      tagline: "超過兩千個社群外掛，皆為開源。",
      description:
        "Raycast Store 集結社群外掛：GitHub、Slack、Notion、Figma、Linear、Jira 等都能搜尋並安裝。外掛以 React 與 TypeScript 開發。",
      shortcuts: [
        { keys: ["搜尋 Store"], description: "找外掛" },
        { keys: ["Enter"], description: "安裝外掛" },
        { keys: ["Cmd", "K"], description: "外掛動作" },
      ],
      tip: "外掛皆開源，可自行 fork 修改。",
    },
  ],
  [
    "ai",
    {
      id: "ai",
      name: "AI",
      icon: Sparkles,
      iconUrl: iconAI,
      color: "#FF6363",
      tagline: "指令列內建 AI 對話與指令。",
      description:
        "Raycast AI 把語言模型帶進工作流：問答、摘要、翻譯、產生程式碼，還能自訂 AI 指令處理重複工作，不必切換視窗。",
      shortcuts: [
        { keys: ["Tab"], description: "開啟 AI 聊天" },
        { keys: ["選取文字", "Ask AI"], description: "處理選取內容" },
        { keys: ["Cmd", "J"], description: "快速 AI 指令" },
      ],
      tip: "可為「摘要信件、產生 commit 訊息」等建立自訂 AI 指令。",
    },
  ],
  [
    "notes",
    {
      id: "notes",
      name: "備忘錄",
      icon: StickyNote,
      iconUrl: iconNotes,
      color: "#5fc992",
      tagline: "浮動備忘，隨開隨寫。",
      description:
        "Raycast Notes 讓你快速記下想法，可設定浮在其他視窗之上；也可從指令列搜尋與建立筆記。",
      shortcuts: [
        { keys: ["輸入 note"], description: "建立或搜尋筆記" },
        { keys: ["Cmd", "N"], description: "新筆記" },
        { keys: ["Cmd", "Enter"], description: "切換浮在上方" },
      ],
      tip: "需要邊查資料邊對照時，浮動最方便。",
    },
  ],
  [
    "focus",
    {
      id: "focus",
      name: "專注模式",
      icon: EyeOff,
      iconUrl: iconFocus,
      color: "#ffbc33",
      tagline: "暫時封鎖干擾 App 與網站。",
      description:
        "設定專注時段，封鎖容易分心的 App 與網站；可排程在固定時段自動開始，配合深度工作節奏。",
      shortcuts: [
        { keys: ["輸入 focus"], description: "開始專注時段" },
        { keys: ["設定時長"], description: "選擇長度" },
        { keys: ["選擇封鎖項目"], description: "設定封鎖清單" },
      ],
      tip: "可在生產力最高的時段排程自動開始。",
    },
  ],
  [
    "system",
    {
      id: "system",
      name: "系統指令",
      icon: Terminal,
      iconUrl: iconSystem,
      color: "#55b3ff",
      tagline: "睡眠、鎖定、清空垃圾桶等，不必翻系統選單。",
      description:
        "一鍵執行睡眠、鎖定、重啟、清空垃圾桶、退出磁碟、切換深色模式等。比進「系統設定」或選單更快。",
      shortcuts: [
        { keys: ["輸入 lock"], description: "鎖定螢幕" },
        { keys: ["輸入 sleep"], description: "讓 Mac 睡眠" },
        { keys: ["輸入 trash"], description: "清空垃圾桶" },
      ],
      tip: "常用系統動作兩三下鍵就能完成。",
    },
  ],
]);
