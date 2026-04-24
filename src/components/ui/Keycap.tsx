interface KeycapProps {
  children: React.ReactNode;
}

export function Keycap({ children }: KeycapProps) {
  return (
    <kbd className="text-foreground inline-flex min-w-[22px] items-center justify-center rounded-[5px] bg-[linear-gradient(180deg,#161616_0%,#0d0d0d_100%)] px-1.5 py-0.5 text-[12px] leading-[1.33] font-semibold shadow-[rgba(0,0,0,0.4)_0px_2px_0px_0.5px,rgba(0,0,0,0.25)_0px_2px_4px_-1px,rgba(255,255,255,0.12)_0px_1px_0px_0px_inset,rgba(0,0,0,0.18)_0px_-1px_0px_0px_inset,rgba(255,255,255,0.05)_0px_0px_0px_1px]">
      {children}
    </kbd>
  );
}
