import { AmbassadorCard } from "../ui/AmbassadorCard";
import { SectionTag } from "../ui/SectionTag";
import { ambassadors } from "../../data/ambassadors";
import tokyoMeetupPhoto from "../../assets/ambassadors/tokyo-meetup/raycast-tokyo-meetup.png";
import raycastFamilyPhoto from "../../assets/ambassadors/tokyo-meetup/raycast-family.png";
import { motion } from "framer-motion";

export function AmbassadorsSection() {
  return (
    <section id="ambassadors" className="scroll-mt-[110px] py-24 md:py-28">
      <div className="container">
        <SectionTag>AMBASSADORS</SectionTag>
        <h2 className="text-foreground mt-3">Raycast Taiwan 大使</h2>

        <div className="mt-14 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {ambassadors.map((ambassador, index) => (
            <AmbassadorCard
              key={ambassador.id}
              ambassador={ambassador}
              index={index}
            />
          ))}
        </div>

        <motion.div
          className="mt-14 px-4 py-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <h3 className="text-foreground text-[24px] font-medium tracking-[0.2px]">
            想成為大使嗎？
          </h3>
          <p className="text-light-gray mt-3 text-[16px] leading-[1.6] font-medium tracking-[0.2px]">
            加入全球 Ambassador 計畫，代表你的城市分享 Raycast。
          </p>
          <div className="mt-6 flex items-center justify-center">
            <a
              href="https://www.raycast.com/ambassadors"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_100%)] px-6 py-2.5 text-[14px] font-semibold tracking-[0.3px] text-[rgba(246,251,255,0.95)] shadow-[0_10px_22px_-14px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-sm transition hover:border-white/30 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_100%)] hover:opacity-60"
            >
              了解更多
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <motion.div
            className="mt-10 grid gap-3 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <figure className="overflow-hidden rounded-[18px] border border-white/12 bg-white/4">
              <img
                src={tokyoMeetupPhoto}
                alt="Taiwan Ambassador 與 Japan Ambassador 在 Tokyo Meetup 合照"
                className="h-full min-h-[220px] w-full object-cover"
                loading="lazy"
              />
            </figure>
            <figure className="overflow-hidden rounded-[18px] border border-white/12 bg-white/4">
              <img
                src={raycastFamilyPhoto}
                alt="Taiwan Ambassador、Japan Ambassador 與 Raycast team 合照"
                className="h-full min-h-[220px] w-full object-cover"
                loading="lazy"
              />
            </figure>
          </motion.div>
          <p className="text-light-gray mt-4 text-[14px] leading-[1.6] font-medium tracking-[0.2px]">
            Taiwan Ambassador 與 Japan Ambassador、Raycast team 在 Tokyo Meetup
            的交流時刻。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
