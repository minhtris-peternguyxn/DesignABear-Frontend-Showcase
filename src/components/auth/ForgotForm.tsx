"use client";

import InputField from "./InputField";
import SocialButtons from "./SocialButtons";
import { IoMailOutline } from "react-icons/io5";
import { useLanguage } from "@/contexts/LanguageContext";

interface ForgotFormProps {
  onSwitchLogin: () => void;
}

export default function ForgotForm({ onSwitchLogin }: ForgotFormProps) {
  const { locale, t } = useLanguage();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for forgot password would go here
  };

  return (
    <form onSubmit={handleSubmit} method="POST">
      <div className="field-item text-center mb-8">
        <h1 className="font-black text-[#1A1A2E] text-3xl leading-tight mb-2">
          {t.auth.forgotTitle}
        </h1>
        <p className="text-[#6B7280] text-sm leading-relaxed">
          {t.auth.forgotSubtitle}
        </p>
      </div>

      <div className="field-item space-y-4">
        <InputField
          type="email"
          placeholder={t.auth.emailPlaceholder}
          rightIcon={<IoMailOutline />}
          name="email"
        />
      </div>

      <div className="field-item mt-5">
        <button
          type="submit"
          className="w-full bg-[#17409A] text-white font-bold py-4 rounded-2xl hover:bg-[#0E2A66] transition-colors duration-200 shadow-lg shadow-[#17409A]/20 text-base"
        >
          {t.auth.forgotBtn}
        </button>
      </div>

      <div className="field-item mt-5">
        <SocialButtons label={locale === "vi" ? "đăng nhập" : "log in"} />
      </div>

      <div className="field-item text-center text-sm text-[#6B7280] mt-4">
        {t.auth.hasAccount}{" "}
        <button
          type="button"
          onClick={onSwitchLogin}
          className="text-[#17409A] font-bold hover:underline underline-offset-2"
        >
          {t.auth.login}
        </button>
      </div>
    </form>
  );
}
