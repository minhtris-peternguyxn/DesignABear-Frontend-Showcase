import { GiBearFace, GiPawPrint } from "react-icons/gi";
import { useLanguage } from "@/contexts/LanguageContext";
import StoryWordReveal from "./StoryWordReveal";

export default function StoryHero() {
  const { t } = useLanguage();

  const translatedMetrics = [
    { label: t.story.metrics.families, value: t.story.metrics.familiesValue, color: "#17409A" },
    { label: t.story.metrics.lessons, value: t.story.metrics.lessonsValue, color: "#4ECDC4" },
    { label: t.story.metrics.activeIot, value: t.story.metrics.activeIotValue, color: "#7C5CFC" },
    { label: t.story.metrics.satisfaction, value: t.story.metrics.satisfactionValue, color: "#FF8C42" },
  ];

  return (
    <section className="bg-[#F4F7FF] pt-30 pb-20 md:pt-40 md:pb-24">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div className="story-panel rounded-[28px] bg-white border border-[#E5E7EB] p-7 md:p-10 lg:p-12 shadow-lg relative overflow-hidden">
          <span className="story-watermark hidden md:block pointer-events-none absolute right-8 bottom-3 text-[90px] md:text-[120px] font-black text-[#17409A] opacity-[0.06] leading-none">
            {t.story.hero.watermark}
          </span>
          <GiPawPrint
            className="absolute -right-6 -top-7 text-[130px] opacity-5 text-[#17409A]"
            aria-hidden
          />

          <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-8 lg:gap-10 items-end">
            <div className="max-w-4xl">
              <span className="story-chapter-title inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[#17409A]/10 text-[#17409A] text-sm font-bold">
                <GiBearFace className="text-lg" />
                {t.story.hero.chapter}
              </span>

              <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-black text-[#17409A] leading-tight">
                <span className="block leading-tight">
                  <StoryWordReveal text={t.story.hero.title1} />
                </span>
                <span className="block leading-tight">
                  <StoryWordReveal text={t.story.hero.title2} />
                </span>
              </h1>

              <p className="mt-6 text-base md:text-lg text-[#6B7280] leading-relaxed max-w-3xl">
                {t.story.hero.desc}
              </p>
            </div>

            <div className="story-panel rounded-3xl bg-[#17409A] p-6 md:p-7 text-white shadow-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-bold">
                {t.story.hero.narrativeTitle}
              </p>
              <p className="mt-3 text-lg md:text-xl font-extrabold leading-snug">
                <StoryWordReveal text={t.story.hero.narrativeDesc} />
              </p>
            </div>
          </div>

          <div className="mt-9 md:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {translatedMetrics.map((item) => (
              <div
                key={item.label}
                className="story-panel rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 md:p-5"
              >
                <p
                  className="text-xl md:text-2xl font-black"
                  style={{ color: item.color }}
                >
                  {item.value}
                </p>
                <p className="mt-1 text-xs md:text-sm text-[#6B7280] font-semibold">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

