"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

/* ── Paw print SVG ────────────────────────────── */
function PawSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
      <ellipse cx="50" cy="65" rx="30" ry="25" />
      <ellipse cx="22" cy="38" rx="12" ry="10" />
      <ellipse cx="78" cy="38" rx="12" ry="10" />
      <ellipse cx="12" cy="58" rx="9" ry="8" />
      <ellipse cx="88" cy="58" rx="9" ry="8" />
    </svg>
  );
}

/* ── Feature icon SVGs ───────────────────────── */
function IconAI() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-6 h-6"
    >
      <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
      <path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-6 h-6"
    >
      <path d="M2 22 12 12" strokeLinecap="round" />
      <path d="M12 12C12 7 16 3 21 3c0 5-4 9-9 9z" />
    </svg>
  );
}

function IconBrush() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-6 h-6"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L3 14.67V21h6.33L20.84 9.5a5.5 5.5 0 0 0 0-7.78v-.11z" />
      <path d="M16 8l-2-2" strokeLinecap="round" />
    </svg>
  );
}

function IconTruck() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-6 h-6"
    >
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 5v4h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

type PawPos = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  rotate: number;
  opacity: number;
};

const PAWS: PawPos[] = [
  { top: "5%", left: "2%", size: 56, rotate: -25, opacity: 0.07 },
  { top: "18%", right: "3%", size: 38, rotate: 20, opacity: 0.06 },
  { top: "50%", left: "38%", size: 24, rotate: 12, opacity: 0.05 },
  { bottom: "8%", left: "9%", size: 44, rotate: 38, opacity: 0.06 },
  { bottom: "5%", right: "14%", size: 32, rotate: -18, opacity: 0.07 },
  { top: "70%", right: "28%", size: 18, rotate: 55, opacity: 0.05 },
];

const FEATURES = [
  {
    Icon: IconAI,
    accent: "#4A90E2",
    title: "Chip AI thông minh",
    desc: "Học hỏi và thích nghi theo từng bé, cá nhân hoá nội dung mỗi ngày.",
    num: "01",
  },
  {
    Icon: IconLeaf,
    accent: "#4ECDC4",
    title: "Vật liệu an toàn",
    desc: "100% cotton hữu cơ, không hoá chất, đạt tiêu chuẩn quốc tế.",
    num: "02",
  },
  {
    Icon: IconBrush,
    accent: "#FF8C42",
    title: "Tự thiết kế",
    desc: "Chọn màu sắc, trang phục, giọng nói và cá tính riêng cho bé.",
    num: "03",
  },
  {
    Icon: IconTruck,
    accent: "#93BBFF",
    title: "Giao hàng nhanh",
    desc: "Đóng gói thủ công cao cấp, toàn quốc trong 3–5 ngày làm việc.",
    num: "04",
  },
];

const STATS = [
  { value: "10,000+", label: "Gia đình tin dùng" },
  { value: "4.9 / 5", label: "Đánh giá trung bình" },
  { value: "98%", label: "Khách hàng hài lòng" },
  { value: "50+", label: "Mẫu gấu độc quyền" },
];

export default function ProductsFeatureBanner() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const translatedFeatures = FEATURES.map((feat) => {
    let title = "";
    let desc = "";
    if (feat.num === "01") {
      title = t.products.banner.features.aiTitle;
      desc = t.products.banner.features.aiDesc;
    } else if (feat.num === "02") {
      title = t.products.banner.features.materialTitle;
      desc = t.products.banner.features.materialDesc;
    } else if (feat.num === "03") {
      title = t.products.banner.features.designTitle;
      desc = t.products.banner.features.designDesc;
    } else {
      title = t.products.banner.features.deliveryTitle;
      desc = t.products.banner.features.deliveryDesc;
    }
    return { ...feat, title, desc };
  });

  const translatedStats = STATS.map((stat, idx) => {
    let label = "";
    if (idx === 0) label = t.products.banner.stats.families;
    else if (idx === 1) label = t.products.banner.stats.rating;
    else if (idx === 2) label = t.products.banner.stats.satisfied;
    else label = t.products.banner.stats.exclusive;
    return { ...stat, label };
  });

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll<HTMLElement>(".feat-anim");
    gsap.fromTo(
      els,
      { y: 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      },
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0E2A66] py-20 md:py-28"
    >
      {/* Subtle radial glow top-right */}
      <div className="absolute -top-32 -right-32 w-150 h-150 rounded-full bg-[#17409A]/40 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-100 h-100 rounded-full bg-[#4A90E2]/20 blur-[100px] pointer-events-none" />

      {/* Paw decorations */}
      {PAWS.map((p, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            top: p.top,
            bottom: p.bottom,
            left: p.left,
            right: p.right,
            transform: `rotate(${p.rotate}deg)`,
            opacity: p.opacity,
          }}
        >
          <PawSVG size={p.size} color="white" />
        </div>
      ))}

      <div className="max-w-screen-2xl mx-auto px-6 md:px-16">
        {/* ── Section header ── */}
        <div className="text-center mb-14 md:mb-18">
          <p className="feat-anim text-[#93BBFF] font-bold text-xs uppercase tracking-[0.22em] mb-4">
            {t.products.banner.subtitle}
          </p>
          <h2 className="feat-anim text-white font-black text-3xl md:text-5xl leading-tight">
            {t.products.banner.titleLine1}
            <span className="text-[#93BBFF]">{t.products.banner.titleLine2}</span>
          </h2>
        </div>

        {/* ── Main content: feature cards (left) + bear (right) ── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-stretch mb-14 md:mb-18">
          {/* Feature cards — 2×2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {translatedFeatures.map(({ Icon, accent, title, desc, num }) => (
              <div
                key={num}
                className="feat-anim group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/9 hover:border-white/20 transition-all duration-300 overflow-hidden"
              >
                {/* Ghost number watermark */}
                <span className="absolute -top-2 -right-1 font-black text-7xl leading-none text-white/4 select-none pointer-events-none">
                  {num}
                </span>

                {/* Icon badge */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 shrink-0"
                  style={{ backgroundColor: `${accent}22`, color: accent }}
                >
                  <Icon />
                </div>

                <h3 className="text-white font-black text-base mb-2 leading-snug">
                  {title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>

                {/* Bottom accent line on hover */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: accent }}
                />
              </div>
            ))}
          </div>

          {/* Bear column */}
          <div className="feat-anim flex flex-col items-center justify-between gap-8 lg:w-80 xl:w-96 shrink-0">
            {/* Bear */}
            <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-full lg:h-72 xl:h-80 flex-1">
              <div className="absolute inset-0 rounded-full bg-[#17409A]/45 blur-3xl scale-110" />
              <div className="absolute inset-0 rounded-full border border-white/8" />
              <div className="absolute inset-6 rounded-full border border-white/4" />
              <Image
                src="/teddy_bear.png"
                alt="Design A Bear mascot"
                fill
                className="object-contain relative z-10 drop-shadow-2xl"
              />
            </div>

            {/* CTA card */}
            <div className="feat-anim w-full bg-white/8 border border-white/12 rounded-3xl p-6 text-center">
              <p className="text-white font-black text-lg leading-snug mb-2">
                {t.products.banner.ctaTitle}
              </p>
              <p className="text-white/50 text-sm mb-5 leading-relaxed">
                {t.products.banner.ctaSub}
              </p>
              <Link
                href="/customize"
                className="block w-full py-3.5 rounded-2xl bg-white text-[#0E2A66] font-black text-sm tracking-wide shadow-xl hover:bg-[#93BBFF] transition-colors duration-300"
              >
                {t.products.banner.ctaBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="feat-anim flex items-stretch bg-white/6 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10">
          {translatedStats.map((s, i) => (
            <div
              key={s.label}
              className={`flex-1 text-center py-5 px-3 ${
                i < STATS.length - 1 ? "border-r border-white/10" : ""
              }`}
            >
              <p className="text-white font-black text-xl md:text-2xl">
                {s.value}
              </p>
              <p className="text-white/45 text-xs mt-1 leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-14 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/8" />
          <PawSVG size={18} color="white" />
          <PawSVG size={12} color="white" />
          <PawSVG size={18} color="white" />
          <div className="h-px flex-1 bg-white/8" />
        </div>
        <p className="text-center text-white/25 text-xs mt-4 tracking-[0.2em] uppercase">
          {t.products.banner.footer}
        </p>
      </div>
    </section>
  );
}
