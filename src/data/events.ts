export interface TaiwanEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  url?: string;
  theme: "ruby" | "emerald" | "amber" | "violet" | "slate" | "copper";
  imageLabel: string;
  imageKicker: string;
  imageUrl?: string;
  imageUrls?: string[];
  hasGallery?: boolean;
}

export const taiwanEvents: TaiwanEvent[] = [
  {
    id: "raycafe-taichung-10-19",
    title: "Raycafé Taichung",
    date: "2025-10-19",
    time: "13:00 - 15:00",
    location: "台中 · 南區",
    description: "Raycast 在地社群聚會，交流實作技巧並認識更多使用者。",
    url: "https://luma.com/79ktnble?locale=zh",
    theme: "copper",
    imageLabel: "Raycafé Taichung",
    imageKicker: "Community Meetup",
    imageUrl:
      "https://images.lumacdn.com/event-covers/va/8130bae4-f4f2-4625-b3df-70bfc883eaa9.png",
    hasGallery: true,
  },
  {
    id: "tw-2",
    title: "Raycafé Taipei",
    date: "2025-11-04",
    time: "19:30 - 21:30",
    location: "台北 · 五倍學院",
    description:
      "與在地社群成員相聚，交流 Raycast 技巧並一起討論實際使用情境。",
    url: "https://luma.com/uyg0p2yg",
    theme: "ruby",
    imageLabel: "Raycafé Taipei",
    imageKicker: "Community Meetup",
    imageUrl:
      "https://images.lumacdn.com/event-covers/mc/59658ddc-3633-410e-af47-ff6fca159e5f.png",
  },
];
