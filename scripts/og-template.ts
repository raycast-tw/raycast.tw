interface ThemeStyle {
  bg: string;
  glow: string;
  accent: string;
}

const themePresets: Record<string, ThemeStyle> = {
  crimson: {
    bg: "linear-gradient(135deg, #1a1014 0%, #0c0a0d 100%)",
    glow: "radial-gradient(circle at 78% 18%, rgba(255,108,132,0.42) 0%, rgba(255,108,132,0) 56%)",
    accent: "#FF6C84",
  },
  indigo: {
    bg: "linear-gradient(135deg, #11142a 0%, #08091a 100%)",
    glow: "radial-gradient(circle at 78% 18%, rgba(108,132,255,0.42) 0%, rgba(108,132,255,0) 56%)",
    accent: "#8AA0FF",
  },
  emerald: {
    bg: "linear-gradient(135deg, #0f1f1c 0%, #08110f 100%)",
    glow: "radial-gradient(circle at 78% 18%, rgba(92,214,149,0.40) 0%, rgba(92,214,149,0) 56%)",
    accent: "#5CD695",
  },
  violet: {
    bg: "linear-gradient(135deg, #14152e 0%, #09081a 100%)",
    glow: "radial-gradient(circle at 78% 18%, rgba(154,122,255,0.40) 0%, rgba(154,122,255,0) 56%)",
    accent: "#B59BFF",
  },
  amber: {
    bg: "linear-gradient(135deg, #1f1810 0%, #110d09 100%)",
    glow: "radial-gradient(circle at 78% 18%, rgba(255,191,96,0.38) 0%, rgba(255,191,96,0) 56%)",
    accent: "#FFC773",
  },
  ruby: {
    bg: "linear-gradient(135deg, #1a0f15 0%, #0c0709 100%)",
    glow: "radial-gradient(circle at 22% 22%, rgba(255,104,131,0.42) 0%, rgba(255,104,131,0) 56%)",
    accent: "#FF8497",
  },
  copper: {
    bg: "linear-gradient(135deg, #1c130d 0%, #110b07 100%)",
    glow: "radial-gradient(circle at 22% 22%, rgba(255,153,113,0.40) 0%, rgba(255,153,113,0) 56%)",
    accent: "#FFA688",
  },
  slate: {
    bg: "linear-gradient(135deg, #14171e 0%, #0a0c11 100%)",
    glow: "radial-gradient(circle at 22% 22%, rgba(203,214,255,0.30) 0%, rgba(203,214,255,0) 56%)",
    accent: "#CBD6FF",
  },
};

export interface OgInput {
  kicker: string;
  badge: string;
  title: string;
  meta: string;
  theme?: string;
  logoDataUri: string;
}

export function ogNode(input: OgInput) {
  const t = themePresets[input.theme ?? "crimson"] ?? themePresets.crimson;

  return {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: t.bg,
        color: "#FFFFFF",
        fontFamily: "Noto Sans TC",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              inset: "0",
              background: t.glow,
              display: "flex",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          width: "56px",
                          height: "56px",
                          borderRadius: "14px",
                          background:
                            "linear-gradient(135deg, rgba(255,99,99,0.18) 0%, rgba(255,154,154,0.06) 100%)",
                          border: "1px solid rgba(255,99,99,0.25)",
                          boxShadow: "0 14px 34px -10px rgba(255,89,117,0.45)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        children: {
                          type: "img",
                          props: {
                            src: input.logoDataUri,
                            width: 36,
                            height: 36,
                          },
                        },
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "22px",
                          fontWeight: 600,
                          letterSpacing: "0.2px",
                          color: "#FFFFFF",
                        },
                        children: "Raycast Community Taiwan",
                      },
                    },
                  ],
                },
              },
              input.kicker
                ? {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "18px",
                        fontWeight: 500,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: t.accent,
                      },
                      children: input.kicker,
                    },
                  }
                : null,
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              maxWidth: "1040px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignSelf: "flex-start",
                    padding: "8px 18px",
                    borderRadius: "999px",
                    border: `1px solid ${t.accent}55`,
                    background: `${t.accent}15`,
                    color: t.accent,
                    fontSize: "20px",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  },
                  children: input.badge,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "62px",
                    fontWeight: 700,
                    lineHeight: 1.12,
                    letterSpacing: "-0.01em",
                    color: "#FFFFFF",
                    display: "flex",
                  },
                  children: input.title,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "22px",
              color: "rgba(255,255,255,0.62)",
              fontWeight: 500,
              letterSpacing: "0.04em",
            },
            children: [
              {
                type: "div",
                props: { style: { display: "flex" }, children: input.meta },
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", color: "rgba(255,255,255,0.5)" },
                  children: "raycast.tw",
                },
              },
            ],
          },
        },
      ],
    },
  };
}
