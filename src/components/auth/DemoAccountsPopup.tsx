"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  IoKeyOutline, 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoCopyOutline, 
  IoCheckmark, 
  IoCloseOutline,
  IoLanguageOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoSparkles
} from "react-icons/io5";

interface DemoAccountsPopupProps {
  onAutofill: (email: string, password: string) => void;
}

const content = {
  vi: {
    floatingBtn: "Tài khoản Demo",
    modalTitleEnter: "🔑 Nhập mật khẩu Demo",
    modalSubtitleEnter: "Vui lòng nhập mật khẩu bí mật được cấp để lấy danh sách tài khoản demo.",
    passwordPlaceholder: "Nhập mật khẩu truy cập...",
    submitBtn: "Xác nhận",
    invalidPassword: "Mật khẩu không chính xác!",
    modalTitleList: "🎉 Tài khoản Demo",
    modalSubtitleList: "Sao chép thông tin hoặc chọn Tự động điền để đăng nhập nhanh.",
    roleCustomer: "Khách hàng",
    roleStaff: "Nhân viên (Staff)",
    roleQC: "Kiểm định (QC)",
    roleCraftsman: "Thợ thủ công (Craftsman)",
    roleAdmin: "Quản trị viên (Admin)",
    emailLabel: "Email",
    passwordLabel: "Mật khẩu",
    copied: "Đã sao chép!",
    autofillBtn: "Tự động điền",
    thankYou: "🙏 Cảm ơn bạn đã trải nghiệm và đánh giá dự án Design a Bear!",
    closeBtn: "Đóng",
  },
  en: {
    floatingBtn: "Demo Accounts",
    modalTitleEnter: "🔑 Enter Demo Password",
    modalSubtitleEnter: "Please enter the provided secret password to unlock demo credentials.",
    passwordPlaceholder: "Enter secret password...",
    submitBtn: "Confirm",
    invalidPassword: "Incorrect password!",
    modalTitleList: "🎉 Demo Accounts",
    modalSubtitleList: "Copy details or choose Auto-fill to log in quickly.",
    roleCustomer: "Customer",
    roleStaff: "Staff",
    roleQC: "QC Team",
    roleCraftsman: "Craftsman",
    roleAdmin: "Administrator",
    emailLabel: "Email",
    passwordLabel: "Password",
    copied: "Copied!",
    autofillBtn: "Auto-fill",
    thankYou: "🙏 Thank you for experiencing and reviewing the Design a Bear project!",
    closeBtn: "Close",
  }
};

const demoAccounts = [
  {
    roleKey: "roleCustomer" as const,
    email: "user@designabear.vn",
    password: "user123",
    colorClass: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    roleKey: "roleStaff" as const,
    email: "staff@designabear.vn",
    password: "staff123",
    colorClass: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border-sky-500/20",
  },
  {
    roleKey: "roleQC" as const,
    email: "qc@dab.vn",
    password: "qc123",
    colorClass: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20",
  },
  {
    roleKey: "roleCraftsman" as const,
    email: "craftman@dab.vn",
    password: "craftman123",
    colorClass: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/20",
  },
  {
    roleKey: "roleAdmin" as const,
    email: "admin@designabear.vn",
    password: "admin123",
    colorClass: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20",
  },
];

export default function DemoAccountsPopup({ onAutofill }: DemoAccountsPopupProps) {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const t = content[locale];

  // Save auth state to session storage to avoid re-entering password on same session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("demo_accounts_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "minhtri10504") {
      setIsAuthenticated(true);
      setErrorMsg("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("demo_accounts_auth", "true");
      }
    } else {
      setErrorMsg(t.invalidPassword);
    }
  };

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const handleAutofillAction = (email: string, pass: string) => {
    onAutofill(email, pass);
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    setLocale(locale === "vi" ? "en" : "vi");
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#17409A] to-[#3B82F6] text-white font-bold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
        <IoKeyOutline className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="text-sm tracking-wide font-fredoka">{t.floatingBtn}</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300">
          <div className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800/60 rounded-3xl shadow-2xl shadow-black/30 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header / Language Switcher */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800/80 px-6 py-4">
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
              >
                <IoLanguageOutline className="w-3.5 h-3.5" />
                <span>{locale === "vi" ? "English" : "Tiếng Việt"}</span>
              </button>
              
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <IoCloseOutline className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area */}
            <div className="overflow-y-auto px-6 py-6 flex-1">
              {!isAuthenticated ? (
                /* Step 1: Password Input */
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-2">
                      <IoLockClosedOutline className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white font-fredoka">
                      {t.modalTitleEnter}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-2">
                      {t.modalSubtitleEnter}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder={t.passwordPlaceholder}
                        className="w-full pl-4 pr-11 py-3.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/60 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <IoEyeOffOutline className="w-5 h-5" />
                        ) : (
                          <IoEyeOutline className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errorMsg && (
                      <p className="text-xs font-semibold text-red-500 dark:text-red-400 pl-1 animate-pulse">
                        {errorMsg}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all cursor-pointer"
                  >
                    {t.submitBtn}
                  </button>
                </form>
              ) : (
                /* Step 2: Credentials List */
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white font-fredoka flex items-center justify-center gap-1.5">
                      <IoSparkles className="w-5 h-5 text-amber-500" />
                      {t.modalTitleList}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.modalSubtitleList}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {demoAccounts.map((account) => {
                      const accountKey = account.roleKey;
                      const roleDisplay = t[accountKey];
                      
                      return (
                        <div 
                          key={account.email}
                          className="group border border-gray-100 dark:border-slate-800/80 rounded-2xl p-4 bg-gray-50/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800/40 hover:shadow-md hover:border-gray-200 dark:hover:border-slate-700/50 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between mb-3.5">
                            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${account.colorClass}`}>
                              {roleDisplay}
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => handleAutofillAction(account.email, account.password)}
                              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <IoSparkles className="w-3.5 h-3.5" />
                              {t.autofillBtn}
                            </button>
                          </div>

                          <div className="space-y-2.5 text-sm">
                            {/* Email Row */}
                            <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                              <span className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                                <IoMailOutline className="w-4 h-4" />
                                {t.emailLabel}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-medium text-gray-900 dark:text-gray-100 select-all">
                                  {account.email}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(account.email, `${account.email}-email`)}
                                  className="p-1 hover:bg-gray-200/60 dark:hover:bg-slate-700/60 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                                  title="Copy Email"
                                >
                                  {copiedText === `${account.email}-email` ? (
                                    <IoCheckmark className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <IoCopyOutline className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Password Row */}
                            <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                              <span className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                                <IoLockClosedOutline className="w-4 h-4" />
                                {t.passwordLabel}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-medium text-gray-900 dark:text-gray-100 select-all">
                                  {account.password}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(account.password, `${account.email}-password`)}
                                  className="p-1 hover:bg-gray-200/60 dark:hover:bg-slate-700/60 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                                  title="Copy Password"
                                >
                                  {copiedText === `${account.email}-password` ? (
                                    <IoCheckmark className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <IoCopyOutline className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Thank you note */}
                  <div className="pt-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-slate-800/80">
                    {t.thankYou}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 dark:border-slate-800/80 px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {t.closeBtn}
              </button>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
