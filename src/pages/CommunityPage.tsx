import { HeroSection } from "../components/community/HeroSection";
import { MazeSection } from "../components/community/MazeSection";
import { EventsSection } from "../components/community/EventsSection";
import { AmbassadorsSection } from "../components/community/AmbassadorsSection";
import { NewsletterSection } from "../components/community/NewsletterSection";
import { motion } from "framer-motion";

function FadeInSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.section>
  );
}

export function CommunityPage() {
  return (
    <main className="relative overflow-clip">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-136 left-1/2 h-40 w-80 -translate-x-1/2 bg-[rgba(255,86,115,0.08)] opacity-[0.22] blur-[72px]" />
        <div className="absolute bottom-32 left-[32%] h-72 w-72 rounded-full bg-[rgba(95,201,146,0.08)] opacity-85 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] mask-[linear-gradient(180deg,rgba(0,0,0,0.26)_0%,rgba(0,0,0,0)_68%)] bg-size-[120px_120px]" />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <FadeInSection>
          <EventsSection />
        </FadeInSection>
        <FadeInSection>
          <AmbassadorsSection />
        </FadeInSection>
        <FadeInSection>
          <NewsletterSection />
        </FadeInSection>
        <FadeInSection>
          <MazeSection />
        </FadeInSection>
      </div>
    </main>
  );
}
