export interface Ambassador {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
  twitter?: string;
  github?: string;
  threads?: string;
  linkedin?: string;
  website?: string;
}

export const ambassadors: Ambassador[] = [
  {
    id: "yc",
    name: "Yen Cheng",
    role: "Ambassador",
    avatar: "/src/assets/ambassadors/yc.jpg",
    threads: "https://www.threads.com/@yencheng_0802",
    twitter: "https://x.com/ridemountainpig",
    website: "https://yencheng.dev",
  },
  {
    id: "cash",
    name: "Cash Wu",
    role: "Ambassador",
    avatar: "/src/assets/ambassadors/cash.jpg",
    threads: "https://www.threads.com/@cashwugeek",
    twitter: "https://x.com/CashWuGeek",
  },
  {
    id: "1weiho",
    name: "Yiwei",
    role: "Ambassador",
    avatar: "/src/assets/ambassadors/1weiho.jpg",
    threads: "https://www.threads.com/@1weiho",
    twitter: "https://x.com/1weiho",
    website: "https://1wei.dev",
  },
  {
    id: "yukai",
    name: "Yukai",
    role: "Ambassador",
    avatar: null,
    threads: "https://www.threads.com/@yukaii_h",
    twitter: "https://x.com/yukaii_h",
  },
];
