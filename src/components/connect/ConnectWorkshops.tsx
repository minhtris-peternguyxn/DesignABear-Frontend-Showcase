import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { useLanguage } from "@/contexts/LanguageContext";

const upcomingData = [
  {
    id: "w1",
    date: "05/04/2026",
    time: "20:00 - 21:15",
  },
  {
    id: "w2",
    date: "12/04/2026",
    time: "19:30 - 20:45",
  },
  {
    id: "w3",
    date: "19/04/2026",
    time: "20:00 - 21:00",
  },
];

export default function ConnectWorkshops() {
  const { t } = useLanguage();
  return (
    <section className="bg-white py-18 md:py-24">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div className="relative">
          <span className="connect-watermark hidden md:block pointer-events-none absolute right-0 top-0 text-[92px] md:text-[120px] font-black text-[#17409A] opacity-[0.06] leading-none">
            04
          </span>
          <div className="connect-ac mb-9 md:mb-12">
            <p className="connect-chapter-title connect-reveal text-sm font-bold tracking-wider uppercase text-[#9CA3AF]">
              {t.connect.workshops.badge}
            </p>
            <h2 className="connect-reveal mt-3 text-3xl md:text-4xl font-black text-[#17409A]">
              {t.connect.workshops.badge === "Community Calendar" ? "Upcoming Workshops" : "Workshop sắp diễn ra"}
            </h2>
          </div>

          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-5 md:gap-6">
            <div className="space-y-4">
              {upcomingData.map((item) => {
                const title = t.connect.workshops[`${item.id}Title` as keyof typeof t.connect.workshops];
                const host = t.connect.workshops[`${item.id}Host` as keyof typeof t.connect.workshops];
                const seats = t.connect.workshops[`${item.id}Seats` as keyof typeof t.connect.workshops];
                return (
                  <article
                    key={item.id}
                    className="connect-ac rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 md:p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#17409A]/10 text-[#17409A] font-bold">
                        <IoCalendarOutline />
                        {item.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#4ECDC4]/15 text-[#138980] font-bold">
                        <IoTimeOutline />
                        {item.time}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-black text-[#1A1A2E] leading-snug">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-[#6B7280] font-semibold">
                      {host}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#FF8C42]">
                      {seats}
                    </p>
                  </article>
                );
              })}
            </div>

            <aside className="connect-ac rounded-3xl bg-[#17409A] text-white p-6 md:p-7 shadow-xl h-fit lg:sticky lg:top-28">
              <p className="text-xs uppercase tracking-[0.18em] text-white/70 font-bold">
                {t.connect.workshops.whyJoin}
              </p>
              <h3 className="mt-3 text-2xl font-black leading-tight">
                {t.connect.workshops.whyJoinDesc}
              </h3>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="font-bold">{t.connect.workshops.benefit1Title}</p>
                  <p className="mt-1 text-sm text-white/80">
                    {t.connect.workshops.benefit1Desc}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="font-bold">{t.connect.workshops.benefit2Title}</p>
                  <p className="mt-1 text-sm text-white/80">
                    {t.connect.workshops.benefit2Desc}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 flex items-start gap-2">
                  <IoPeopleOutline className="text-xl mt-0.5" />
                  <p className="text-sm text-white/85">
                    {t.connect.workshops.benefit3Desc}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
