import { GiTrophyCup } from "react-icons/gi";
import {
  IoSchoolOutline,
  IoSparklesOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { useLanguage } from "@/contexts/LanguageContext";
import { STORY_MILESTONES } from "@/data/story";
import type { StoryMilestoneIcon } from "@/types/story";

const ICON_BY_KEY: Record<StoryMilestoneIcon, React.ReactNode> = {
  spark: <IoSparklesOutline />,
  classroom: <IoSchoolOutline />,
  ai: <GiTrophyCup />,
  community: <IoPeopleOutline />,
};

export default function StoryTimeline() {
  const { t } = useLanguage();

  const translatedMilestones = [
    {
      ...STORY_MILESTONES[0],
      title: t.story.timeline.milestones.m1.title,
      description: t.story.timeline.milestones.m1.description,
      impact: t.story.timeline.milestones.m1.impact,
    },
    {
      ...STORY_MILESTONES[1],
      title: t.story.timeline.milestones.m2.title,
      description: t.story.timeline.milestones.m2.description,
      impact: t.story.timeline.milestones.m2.impact,
    },
    {
      ...STORY_MILESTONES[2],
      title: t.story.timeline.milestones.m3.title,
      description: t.story.timeline.milestones.m3.description,
      impact: t.story.timeline.milestones.m3.impact,
    },
    {
      ...STORY_MILESTONES[3],
      title: t.story.timeline.milestones.m4.title,
      description: t.story.timeline.milestones.m4.description,
      impact: t.story.timeline.milestones.m4.impact,
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div className="relative">
          <span className="story-watermark hidden md:block pointer-events-none absolute right-0 top-0 text-[90px] md:text-[120px] font-black text-[#17409A] opacity-[0.06] leading-none">
            {t.story.timeline.watermark}
          </span>
          <div className="story-panel mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#17409A]">
              <span className="story-chapter-title story-reveal-wrap block overflow-hidden">
                <span className="story-reveal-line block">
                  {t.story.timeline.chapter}
                </span>
              </span>
            </h2>
            <p className="mt-3 text-[#6B7280] text-base md:text-lg max-w-3xl">
              {t.story.timeline.desc}
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#E5E7EB] -translate-x-1/2" />

            <div className="grid gap-6 md:gap-8">
              {translatedMilestones.map((milestone, idx) => (
                <article
                  key={milestone.id}
                  className={`story-panel ${idx % 2 === 0 ? "story-scene-left" : "story-scene-right"} md:w-[calc(50%-18px)] rounded-3xl border border-[#E5E7EB] p-5 md:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                    idx % 2 === 0
                      ? "md:mr-auto bg-[#F4F7FF]"
                      : "md:ml-auto bg-[#FFFFFF]"
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#17409A] text-white flex items-center justify-center text-xl">
                        {ICON_BY_KEY[milestone.icon]}
                      </div>
                      <p className="text-2xl md:text-3xl font-black text-[#17409A]">
                        {milestone.year}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl md:text-2xl font-extrabold text-[#1A1A2E] leading-tight">
                        {milestone.title}
                      </h3>
                      <p className="mt-2 text-sm md:text-base text-[#6B7280] leading-relaxed">
                        {milestone.description}
                      </p>
                      <div className="mt-4 rounded-2xl bg-white border border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-[#17409A]">
                        {milestone.impact}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

