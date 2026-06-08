"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import SocialButtons from "./SocialButtons";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoCallOutline,
  IoImageOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import type { GoogleCompleteProfileRequest, RegisterRequest } from "@/types";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { z } from "zod";
import { mediaService } from "@/services/media.service";
import { useLanguage } from "@/contexts/LanguageContext";

const registerSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ in hoa")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Số điện thoại phải gồm đúng 10 chữ số"),
  avatarUrl: z
    .string()
    .trim()
    .url("Avatar phải là URL hợp lệ")
    .refine((value) => /^https?:\/\//i.test(value), {
      message: "Avatar URL phải bắt đầu bằng http:// hoặc https://",
    }),
  dateOfBirth: z
    .string()
    .min(1, "Vui lòng chọn ngày sinh")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Ngày sinh không hợp lệ",
    }),
  gender: z.enum(["M", "F"], {
    error: "Giới tính không hợp lệ",
  }),
});

const googleCompleteProfileSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^0[0-9]{9}$/,
      "Phone number must be exactly 10 digits, start with 0, and not be a popular fake number.",
    ),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ in hoa")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  dateOfBirth: z
    .string()
    .min(1, "Vui lòng chọn ngày sinh")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Ngày sinh không hợp lệ",
    }),
  gender: z.enum(["M", "F"], {
    error: "Giới tính không hợp lệ",
  }),
});

type RegisterFieldErrors = Partial<Record<keyof RegisterRequest, string>>;
type GoogleProfilePayload = Omit<
  GoogleCompleteProfileRequest,
  "registrationToken"
>;
type GoogleProfileErrors = Partial<Record<keyof GoogleProfilePayload, string>>;

const MATCHED_INPUT_CLASS =
  "w-full pl-5 pr-4 py-4 rounded-2xl border border-[#E5E7EB] bg-white/50 text-[#1A1A2E] text-sm focus:outline-none focus:border-[#17409A] focus:bg-white/80 transition-all duration-200";

interface RegisterFormProps {
  onSwitchLogin: () => void;
}

export default function RegisterForm({ onSwitchLogin }: RegisterFormProps) {
  const { locale, t } = useLanguage();
  const router = useRouter();
  const {
    signup,
    verifyEmail,
    pendingVerification,
    clearPendingVerification,
    pendingGoogleProfile,
    completeGoogleProfile,
    clearPendingGoogleProfile,
  } = useAuth();
  const { success, error: toastError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFileName, setAvatarFileName] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [googleProfileErrors, setGoogleProfileErrors] =
    useState<GoogleProfileErrors>({});

  const genderOptions = useMemo(() => [
    { label: locale === "vi" ? "Nam" : "Male", value: "M" },
    { label: locale === "vi" ? "Nữ" : "Female", value: "F" },
  ], [locale]);

  const translateRegisterError = (key: string, message: string): string => {
    if (locale !== "en") return message;
    switch (key) {
      case "email":
        if (message.includes("không hợp lệ") || message.includes("invalid")) return "Invalid email address";
        return message;
      case "password":
        if (message.includes("8 ký tự")) return "Password must be at least 8 characters";
        if (message.includes("chữ in hoa")) return "Password must contain at least 1 uppercase letter";
        if (message.includes("chữ thường")) return "Password must contain at least 1 lowercase letter";
        if (message.includes("chữ số")) return "Password must contain at least 1 digit";
        if (message.includes("ký tự đặc biệt")) return "Password must contain at least 1 special character";
        return message;
      case "fullName":
        if (message.includes("2 ký tự")) return "Full name must be at least 2 characters";
        return message;
      case "phoneNumber":
        if (message.includes("10 chữ số")) return "Phone number must be exactly 10 digits";
        return message;
      case "avatarUrl":
        if (message.includes("hợp lệ") || message.includes("http")) return "Avatar must be a valid URL starting with http:// or https://";
        return message;
      case "dateOfBirth":
        if (message.includes("chọn ngày sinh")) return "Please select your date of birth";
        if (message.includes("không hợp lệ")) return "Invalid date of birth";
        return message;
      case "gender":
        if (message.includes("không hợp lệ")) return "Invalid gender";
        return message;
      default:
        return message;
    }
  };

  // Registration form state
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    avatarUrl: "",
    dateOfBirth: "",
    gender: "M",
  });

  // Email verification form state
  const [verificationData, setVerificationData] = useState({
    otp: "",
  });

  const [googleProfileData, setGoogleProfileData] =
    useState<GoogleProfilePayload>({
      phoneNumber: "",
      password: "",
      fullName: "",
      dateOfBirth: "",
      gender: "M",
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
    setError("");
  };

  const handleInputFieldChange =
    (name: keyof RegisterRequest) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
      setError("");
    };

  const otpRefs = useRef<(HTMLInputElement | null)[]>(new Array(6).fill(null));

  const handleOtpBoxChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtpArr = verificationData.otp.split("");
    while (newOtpArr.length < 6) newOtpArr.push("");

    const char = value.slice(-1);
    newOtpArr[index] = char;
    
    const newOtp = newOtpArr.join("");
    setVerificationData(prev => ({ ...prev, otp: newOtp }));
    setError("");

    if (char && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
    if (!pasted) return;

    setVerificationData(prev => ({ ...prev, otp: pasted }));
    setError("");
    
    const nextIdx = Math.min(pasted.length, 5);
    otpRefs.current[nextIdx]?.focus();
  };

  const handleGoogleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setGoogleProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setGoogleProfileErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
    setError("");
  };

  const setGoogleProfileField =
    (name: keyof GoogleProfilePayload) => (value: string) => {
      setGoogleProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setGoogleProfileErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
      setError("");
    };

  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      const message = locale === "vi" ? "Vui lòng chọn file ảnh hợp lệ" : "Please select a valid image file";
      setError(message);
      toastError(message);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const message = locale === "vi" ? "Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB" : "Image is too large. Please select an image smaller than 5MB";
      setError(message);
      toastError(message);
      return;
    }

    try {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      setAvatarFileName(file.name);
      setError("");

      setIsUploadingAvatar(true);
      const uploadRes = await mediaService.uploadMedia(file, "avatars");

      if (uploadRes.isFailure || !uploadRes.value?.publicUrl) {
        throw new Error(uploadRes.error?.description || (locale === "vi" ? "Upload ảnh thất bại" : "Upload image failed"));
      }

      const uploadedUrl = uploadRes.value.publicUrl;

      setFormData((prev) => ({
        ...prev,
        avatarUrl: uploadedUrl,
      }));
      setFieldErrors((prev) => ({
        ...prev,
        avatarUrl: undefined,
      }));
      success(locale === "vi" ? "Đã tải ảnh lên và tự điền Avatar URL" : "Uploaded image and auto-filled Avatar URL");
    } catch (err: any) {
      const message = err.message || (locale === "vi" ? "Không thể tải ảnh từ máy của bạn" : "Cannot upload image from your computer");
      setError(message);
      toastError(message);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  useEffect(() => {
    if (!pendingGoogleProfile) return;

    setGoogleProfileData((prev) => ({
      ...prev,
      phoneNumber: pendingGoogleProfile.phoneNumber ?? prev.phoneNumber,
      fullName: pendingGoogleProfile.fullName ?? prev.fullName,
      dateOfBirth: pendingGoogleProfile.dateOfBirth ?? prev.dateOfBirth,
      gender: pendingGoogleProfile.gender ?? prev.gender,
    }));
  }, [pendingGoogleProfile]);

  const passwordStrength = useMemo(() => {
    const password = formData.password;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    const score = checks.filter(Boolean).length;

    if (!password)
      return { score: 0, label: locale === "vi" ? "Chưa nhập" : "Not entered", color: "bg-gray-300" };
    if (score <= 2) return { score, label: locale === "vi" ? "Yếu" : "Weak", color: "bg-red-500" };
    if (score <= 4)
      return { score, label: locale === "vi" ? "Trung bình" : "Medium", color: "bg-amber-500" };
    return { score, label: locale === "vi" ? "Mạnh" : "Strong", color: "bg-emerald-500" };
  }, [formData.password, locale]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const validated = registerSchema.safeParse(formData);
      if (!validated.success) {
        const nextErrors: RegisterFieldErrors = {};
        const flattened = validated.error.flatten().fieldErrors;

        (Object.keys(flattened) as Array<keyof RegisterRequest>).forEach(
          (key) => {
            const firstError = flattened[key]?.[0];
            if (firstError) {
              nextErrors[key] = translateRegisterError(key, firstError);
            }
          },
        );

        setFieldErrors(nextErrors);
        const message = locale === "vi" ? "Vui lòng kiểm tra lại thông tin đăng ký" : "Please check your registration details";
        setError(message);
        toastError(message);
        return;
      }

      await signup(validated.data);
      success(locale === "vi" ? "Đăng ký thành công, vui lòng kiểm tra email để lấy OTP" : "Registration successful, please check your email for the OTP");
    } catch (err) {
      const message = err instanceof Error ? err.message : (locale === "vi" ? "Đăng ký thất bại" : "Registration failed");
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!verificationData.otp) {
        const message = locale === "vi" ? "Vui lòng nhập mã OTP" : "Please enter the OTP code";
        setError(message);
        toastError(message);
        setIsLoading(false);
        return;
      }

      if (!pendingVerification?.email) {
        const message = locale === "vi" ? "Email không hợp lệ" : "Invalid email";
        setError(message);
        toastError(message);
        setIsLoading(false);
        return;
      }

      await verifyEmail(pendingVerification.email, verificationData.otp);
      success(locale === "vi" ? "Xác nhận email thành công" : "Email verification successful");

      const stored = localStorage.getItem("dab_user");
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role === "admin") {
        router.push("/admin");
      } else if (user?.role === "staff") {
        router.push("/staff");
      } else if (user?.role === "craftsman") {
        router.push("/craftsman");
      } else if (user?.role === "quality_control") {
        router.push("/qc");
      } else {
        router.push("/");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : (locale === "vi" ? "Xác nhận email thất bại" : "Email verification failed");
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setGoogleProfileErrors({});

    try {
      const validated =
        googleCompleteProfileSchema.safeParse(googleProfileData);
      if (!validated.success) {
        const nextErrors: GoogleProfileErrors = {};
        const flattened = validated.error.flatten().fieldErrors;

        (Object.keys(flattened) as Array<keyof GoogleProfilePayload>).forEach(
          (key) => {
            const firstError = flattened[key]?.[0];
            if (firstError) {
              nextErrors[key] = translateRegisterError(key, firstError);
            }
          },
        );

        setGoogleProfileErrors(nextErrors);
        const message = locale === "vi" ? "Vui lòng kiểm tra lại hồ sơ Google" : "Please check your Google profile details";
        setError(message);
        toastError(message);
        return;
      }

      await completeGoogleProfile(validated.data);
      success(locale === "vi" ? "Hoàn tất hồ sơ Google thành công" : "Completed Google profile successfully");

      const stored = localStorage.getItem("dab_user");
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role === "admin") {
        router.push("/admin");
      } else if (user?.role === "staff") {
        router.push("/staff");
      } else if (user?.role === "craftsman") {
        router.push("/craftsman");
      } else if (user?.role === "quality_control") {
        router.push("/qc");
      } else {
        router.push("/");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : (locale === "vi" ? "Hoàn tất hồ sơ Google thất bại" : "Failed to complete Google profile");
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingGoogleProfile) {
    return (
      <>
        <div className="field-item text-center mb-6">
          <h1 className="font-black text-[#1A1A2E] text-3xl leading-tight mb-2">
            {locale === "vi" ? "Hoàn tất hồ sơ Google" : "Complete Google Profile"}
          </h1>
          <p className="text-[#6B7280] text-sm">
            {pendingGoogleProfile.email
              ? (locale === "vi" 
                  ? `Tài khoản ${pendingGoogleProfile.email} cần bổ sung thông tin trước khi đăng nhập.` 
                  : `Account ${pendingGoogleProfile.email} needs additional details before logging in.`)
              : (locale === "vi"
                  ? "Bạn cần bổ sung thông tin trước khi đăng nhập bằng Google."
                  : "You need to complete your profile before logging in with Google.")}
          </p>
        </div>

        <form
          onSubmit={handleGoogleCompleteProfile}
          method="POST"
          className="field-item grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div>
            <InputField
              type="text"
              placeholder={t.auth.fullNamePlaceholder}
              name="fullName"
              value={googleProfileData.fullName}
              onChange={setGoogleProfileField("fullName")}
              rightIcon={<IoPersonOutline />}
            />
            {googleProfileErrors.fullName && (
              <p className="mt-1 text-xs text-red-500">
                {googleProfileErrors.fullName}
              </p>
            )}
          </div>

          <div>
            <InputField
              type="text"
              placeholder={locale === "vi" ? "Số điện thoại" : "Phone number"}
              name="phoneNumber"
              value={googleProfileData.phoneNumber}
              onChange={setGoogleProfileField("phoneNumber")}
              rightIcon={<IoCallOutline />}
            />
            {googleProfileErrors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500">
                {googleProfileErrors.phoneNumber}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <InputField
              type="password"
              placeholder={locale === "vi" ? "Tạo mật khẩu" : "Create password"}
              name="password"
              value={googleProfileData.password}
              onChange={setGoogleProfileField("password")}
              rightIcon={<IoLockClosedOutline />}
            />
            {googleProfileErrors.password && (
              <p className="mt-1 text-xs text-red-500">
                {googleProfileErrors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">
              {locale === "vi" ? "Ngày sinh" : "Date of birth"}
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={googleProfileData.dateOfBirth}
              onChange={handleGoogleProfileChange}
              className={MATCHED_INPUT_CLASS}
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.95rem",
              }}
            />
            {googleProfileErrors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-500">
                {googleProfileErrors.dateOfBirth}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">
              {locale === "vi" ? "Giới tính" : "Gender"}
            </label>
            <CustomDropdown
              options={genderOptions}
              value={googleProfileData.gender}
              onChange={setGoogleProfileField("gender")}
              buttonClassName={`${MATCHED_INPUT_CLASS} flex items-center justify-between`}
              chevronClassName="text-[#9CA3AF] text-xl transition-transform"
              menuClassName="absolute z-30 mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white shadow-xl py-1"
              ariaLabel={locale === "vi" ? "Giới tính" : "Gender"}
            />
            {googleProfileErrors.gender && (
              <p className="mt-1 text-xs text-red-500">
                {googleProfileErrors.gender}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm md:col-span-2">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#17409A] text-white font-bold py-3.5 rounded-2xl hover:bg-[#0E2A66] transition-colors duration-200 shadow-lg shadow-[#17409A]/20 text-base disabled:opacity-50 disabled:cursor-not-allowed md:col-span-2"
          >
            {isLoading ? (locale === "vi" ? "Đang hoàn tất..." : "Completing...") : (locale === "vi" ? "Hoàn tất và đăng nhập" : "Complete & Log In")}
          </button>
        </form>

        <div className="field-item text-center text-sm text-[#6B7280] mt-4">
          <button
            type="button"
            onClick={() => {
              clearPendingGoogleProfile();
              onSwitchLogin();
            }}
            className="text-[#17409A] font-bold hover:underline underline-offset-2"
          >
            {t.auth.backToLogin}
          </button>
        </div>
      </>
    );
  }

  // Show email verification form if registration is pending
  if (pendingVerification) {
    return (
      <>
        <div className="field-item text-center mb-8">
          <h1 className="font-black text-[#1A1A2E] text-3xl leading-tight mb-2">
            {locale === "vi" ? "Xác nhận email" : "Verify Email"}
          </h1>
          <p className="text-[#6B7280] text-sm">
            {locale === "vi" ? "Chúng tôi đã gửi mã OTP đến" : "We have sent the OTP code to"} <br />
            <span className="font-semibold text-[#1A1A2E]">
              {pendingVerification.email}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerifyEmail} method="POST" className="field-item space-y-4">
          <div className="flex justify-between gap-2 mb-6" onPaste={handleOtpPaste}>
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <input
                key={idx}
                ref={(el) => {
                  otpRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={verificationData.otp[idx] || ""}
                onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-black rounded-xl border-2 border-[#E5E7EB] bg-white/50 focus:border-[#17409A] focus:bg-white outline-none transition-all duration-200"
              />
            ))}
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#17409A] text-white font-bold py-4 rounded-2xl hover:bg-[#0E2A66] transition-colors duration-200 shadow-lg shadow-[#17409A]/20 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (locale === "vi" ? "Đang xác nhận..." : "Verifying...") : (locale === "vi" ? "Xác nhận" : "Verify")}
          </button>
        </form>

        <div className="field-item text-center text-sm text-[#6B7280] mt-4">
          <button
            type="button"
            onClick={() => {
              clearPendingVerification();
              setVerificationData({ otp: "" });
              setError("");
            }}
            className="text-[#17409A] font-bold hover:underline underline-offset-2"
          >
            {locale === "vi" ? "Quay lại đăng ký" : "Back to Register"}
          </button>
        </div>
      </>
    );
  }

  // Show registration form
  return (
    <>
      <div className="field-item text-center mb-4">
        <h1 className="font-black text-[#1A1A2E] text-2xl md:text-3xl leading-tight mb-1">
          {t.auth.registerTitle}
        </h1>
        <p className="text-[#6B7280] text-sm md:text-[15px]">
          {t.auth.registerSubtitle}
        </p>
      </div>

      <form
        onSubmit={handleSignup}
        method="POST"
        className="field-item grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <div>
          <InputField
            type="email"
            placeholder={t.auth.emailPlaceholder}
            name="email"
            value={formData.email}
            onChange={handleInputFieldChange("email")}
            rightIcon={<IoMailOutline />}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <InputField
            type="password"
            placeholder={t.auth.passwordPlaceholder}
            name="password"
            value={formData.password}
            onChange={handleInputFieldChange("password")}
            rightIcon={<IoLockClosedOutline />}
          />
          <div className="mt-2">
            <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">
              {locale === "vi" ? "Độ mạnh mật khẩu: " : "Password strength: "}{" "}
              <span className="font-semibold">{passwordStrength.label}</span>
            </p>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <InputField
            type="text"
            placeholder={t.auth.fullNamePlaceholder}
            name="fullName"
            value={formData.fullName}
            onChange={handleInputFieldChange("fullName")}
            rightIcon={<IoPersonOutline />}
          />
          {fieldErrors.fullName && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.fullName}</p>
          )}
        </div>

        <div>
          <InputField
            type="text"
            placeholder={locale === "vi" ? "Số điện thoại" : "Phone number"}
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputFieldChange("phoneNumber")}
            rightIcon={<IoCallOutline />}
          />
          {fieldErrors.phoneNumber && (
            <p className="mt-1 text-xs text-red-500">
              {fieldErrors.phoneNumber}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="w-full px-4 py-4 rounded-2xl border border-[#E5E7EB] bg-white/50 text-[#1A1A2E] text-sm focus-within:border-[#17409A] cursor-pointer flex items-center justify-between gap-3 transition-colors">
            <span className="truncate">
              {avatarPreview
                ? `${locale === "vi" ? "Đã chọn: " : "Selected: "}${avatarFileName || (locale === "vi" ? "Ảnh đại diện" : "Avatar")}`
                : (locale === "vi" ? "Chọn ảnh từ máy" : "Choose image from computer")}
            </span>
            <IoImageOutline className="text-xl text-[#9CA3AF]" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="hidden"
            />
          </label>

          {isUploadingAvatar && (
            <p className="mt-2 text-xs text-[#17409A] font-semibold">
              {locale === "vi" ? "Đang upload ảnh để lấy URL..." : "Uploading image to get URL..."}
            </p>
          )}

          {avatarPreview && (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="h-12 w-12 rounded-full object-cover border border-[#E5E7EB]"
              />
              <button
                type="button"
                onClick={() => {
                  if (avatarPreview.startsWith("blob:")) {
                    URL.revokeObjectURL(avatarPreview);
                  }
                  setAvatarPreview("");
                  setAvatarFileName("");
                  setFormData((prev) => ({
                    ...prev,
                    avatarUrl: "",
                  }));
                }}
                className="text-sm text-[#17409A] font-semibold hover:underline"
              >
                {locale === "vi" ? "Xóa ảnh" : "Delete image"}
              </button>
            </div>
          )}

          <div className="mt-2">
            <InputField
              type="text"
              placeholder="Avatar URL (https://...)"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleInputFieldChange("avatarUrl")}
              rightIcon={<IoImageOutline />}
            />
          </div>

          {fieldErrors.avatarUrl && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.avatarUrl}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1">
            {locale === "vi" ? "Ngày sinh" : "Date of birth"}
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={MATCHED_INPUT_CLASS}
            style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem" }}
          />
          {fieldErrors.dateOfBirth && (
            <p className="mt-1 text-xs text-red-500">
              {fieldErrors.dateOfBirth}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1">
            {locale === "vi" ? "Giới tính" : "Gender"}
          </label>
          <CustomDropdown
            options={genderOptions}
            value={formData.gender}
            onChange={handleInputFieldChange("gender")}
            buttonClassName={`${MATCHED_INPUT_CLASS} flex items-center justify-between`}
            chevronClassName="text-[#9CA3AF] text-xl transition-transform"
            menuClassName="absolute z-30 mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white shadow-xl py-1"
            ariaLabel={locale === "vi" ? "Giới tính" : "Gender"}
          />
          {fieldErrors.gender && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.gender}</p>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm md:col-span-2">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading || isUploadingAvatar}
          className="w-full bg-[#17409A] text-white font-bold py-3.5 rounded-2xl hover:bg-[#0E2A66] transition-colors duration-200 shadow-lg shadow-[#17409A]/20 text-base disabled:opacity-50 disabled:cursor-not-allowed md:col-span-2"
        >
          {isLoading ? t.auth.registering : t.auth.registerBtn}
        </button>
      </form>

      <div className="field-item mt-4">
        <SocialButtons label={locale === "vi" ? "đăng ký" : "register"} />
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
    </>
  );
}
