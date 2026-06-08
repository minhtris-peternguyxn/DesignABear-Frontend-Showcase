import {
  IoChatboxEllipsesOutline,
  IoMailOutline,
  IoLogoFacebook,
  IoLogoYoutube,
} from "react-icons/io5";
import { useLanguage } from "@/contexts/LanguageContext";

const channelsData = [
  {
    id: "c1",
    icon: IoChatboxEllipsesOutline,
    color: "#17409A",
    defaultDetail: "8:00 - 21:00 mỗi ngày",
  },
  {
    id: "c2",
    icon: IoMailOutline,
    color: "#4ECDC4",
    defaultDetail: "hello@designabear.vn",
  },
  {
    id: "c3",
    icon: IoLogoFacebook,
    color: "#7C5CFC",
    defaultDetail: "35.000+ thành viên",
  },
  {
    id: "c4",
    icon: IoLogoYoutube,
    color: "#FF8C42",
    defaultDetail: "Cập nhật 2 video/tuần",
  },
];

export default function ConnectWays() {
  const { locale, t } = useLanguage();
  
  return (
    <section className="bg-white py-18 md:py-24">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div className="relative">
          <span className="connect-watermark hidden md:block pointer-events-none absolute right-0 top-0 text-[92px] md:text-[120px] font-black text-[#17409A] opacity-[0.06] leading-none">
            02
          </span>
          <div className="connect-ac mb-10 md:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="connect-chapter-title connect-reveal text-sm font-bold tracking-wider uppercase text-[#9CA3AF]">
                {t.connect.ways.badge}
              </p>
              <h2 className="connect-reveal mt-3 text-3xl md:text-4xl font-black text-[#17409A]">
                {t.connect.ways.title}
              </h2>
            </div>
            <p className="connect-ac max-w-2xl text-[#6B7280] text-base md:text-lg">
              {t.connect.ways.desc}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {channelsData.map((item) => {
              const Icon = item.icon;
              const title = t.connect.ways[`${item.id}Title` as keyof typeof t.connect.ways] as string;
              const description = t.connect.ways[`${item.id}Desc` as keyof typeof t.connect.ways] as string;
              
              // Resolve detail dynamically
              let detail = item.defaultDetail;
              if (item.id === "c1") {
                detail = t.connect.ways.c1Detail || item.defaultDetail;
              } else if (item.id === "c3") {
                detail = t.connect.ways.c3Detail || item.defaultDetail;
              } else if (item.id === "c4") {
                detail = locale === "vi" ? "Cập nhật 2 video/tuần" : "Updated 2 videos/week";
              }

              return (
                <article
                  key={item.id}
                  className="connect-ac rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="text-2xl" />
                  </div>
                  <h3 className="mt-4 text-xl font-black text-[#1A1A2E] leading-snug">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                    {description}
                  </p>
                  <p
                    className="mt-4 text-sm font-bold"
                    style={{ color: item.color }}
                  >
                    {detail}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
