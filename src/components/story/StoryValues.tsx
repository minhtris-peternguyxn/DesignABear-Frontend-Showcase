import { useLanguage } from "@/contexts/LanguageContext";
import { STORY_VALUES } from "@/data/story";
import StoryWordReveal from "./StoryWordReveal";

export default function StoryValues() {
  const { t } = useLanguage();

  const translatedValues = [
    {
      ...STORY_VALUES[0],
      title: t.story.values.v1.title,
      description: t.story.values.v1.description,
    },
    {
      ...STORY_VALUES[1],
      title: t.story.values.v2.title,
      description: t.story.values.v2.description,
    },
    {
      ...STORY_VALUES[2],
      title: t.story.values.v3.title,
      description: t.story.values.v3.description,
    },
  ];

  return (
    <section className="bg-[#F4F7FF] py-20 md:py-28">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div className="relative">
          <span className="story-watermark hidden md:block pointer-events-none absolute right-0 top-0 text-[90px] md:text-[120px] font-black text-[#17409A] opacity-[0.06] leading-none">
            {t.story.values.watermark}
          </span>
          <div className="story-panel mb-12 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-[#17409A]">
              <span className="story-chapter-title story-reveal-wrap block overflow-hidden">
                <span className="story-reveal-line block">
                  {t.story.values.chapter}
                </span>
              </span>
            </h2>
            <p className="mt-3 text-[#6B7280] text-base md:text-lg max-w-3xl">
              {t.story.values.desc}
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5 md:gap-6 items-start">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {translatedValues.map((value) => (
                <article
                  key={value.id}
                  className="story-panel rounded-3xl bg-white border border-[#E5E7EB] p-6 md:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg"
                    style={{ backgroundColor: value.color }}
                  >
                    {value.id.slice(-1)}
                  </div>

                  <h3 className="mt-4 text-xl font-black text-[#1A1A2E]">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-[#6B7280] text-sm md:text-base leading-relaxed">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>

            <aside className="story-panel rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-lg lg:sticky lg:top-32">
              <p className="text-xs uppercase tracking-[0.18em] text-[#9CA3AF] font-bold">
                {t.story.values.quoteTitle}
              </p>
              <p className="mt-4 text-xl md:text-2xl font-black text-[#17409A] leading-snug">
                <StoryWordReveal text={t.story.values.quoteText} />
              </p>
              <p className="mt-4 text-sm md:text-base text-[#6B7280] leading-relaxed">
                {t.story.values.quoteDesc}
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

