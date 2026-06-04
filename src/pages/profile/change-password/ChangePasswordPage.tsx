import "./change-password.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../context/auth/AuthContext";
import useLayoutBackground from "../../../hooks/useLayoutBackground";
import { changePassword } from "../../../services/auth.service";
import { isFirebaseError } from "../../../utils/firebase-errors";
import PageHeader from "../../../components/layout/PageHeader";
import Input from "../../../ui-kit/input/Input";
import Button from "../../../ui-kit/button/Button";
import EyeToggleIcon from "../../../ui-kit/button/icon-buttons/eye-toggle/EyeToggleIcon";
import Icon from "../../../ui-kit/icons/icon/Icon";

const hasMinLength = (value: string) => value.length >= 6;
const hasUpperCase = (value: string) => /[A-Z]/.test(value);
const hasLowerCase = (value: string) => /[a-z]/.test(value);
const hasNumber = (value: string) => /[0-9]/.test(value);

interface FormFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordPage = () => {
  const { t } = useTranslation("profile");
  const { t: tCommon } = useTranslation("common");
  const { t: tAuth } = useTranslation("auth");
  const { profile } = useAuthContext();
  const navigate = useNavigate();

  const [submitState, setSubmitState] = useState<{ isLoading: boolean; error: string | null }>({
    isLoading: false,
    error: null,
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useLayoutBackground(profile?.role);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    formState: { errors },
  } = useForm<FormFields>({ mode: "onSubmit" });

  const newPassword = watch("newPassword", "");

  const onSubmit = async (data: FormFields) => {
    setSubmitState({ isLoading: true, error: null });
    try {
      await changePassword(data.currentPassword, data.newPassword);
      navigate("/profile", { replace: true, state: { passwordUpdated: true } });
    } catch (error: unknown) {
      if (
        isFirebaseError(error) &&
        (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password")
      ) {
        setError("currentPassword", {
          type: "manual",
          message: t("changePassword.errorWrongPassword"),
        });
        setSubmitState({ isLoading: false, error: null });
        return;
      }
      if (isFirebaseError(error) && error.code === "auth/network-request-failed") {
        setSubmitState({ isLoading: false, error: tCommon("errors.noConnection") });
        return;
      }
      if (isFirebaseError(error) && error.code === "auth/weak-password") {
        setSubmitState({ isLoading: false, error: t("changePassword.errorWeakPassword") });
        return;
      }
      setSubmitState({ isLoading: false, error: t("changePassword.errorDefault") });
    }
  };

  const requirements = [
    { met: hasMinLength(newPassword), label: tAuth("register.passwordMinLength") },
    { met: hasUpperCase(newPassword), label: tAuth("register.passwordUppercase") },
    { met: hasLowerCase(newPassword), label: tAuth("register.passwordLowercase") },
    { met: hasNumber(newPassword), label: tAuth("register.passwordNumber") },
  ];

  return (
    <div className="change-password-page">
      <PageHeader title={t("changePassword.title")} onBack={() => navigate(-1)} />

      <form className="change-password-page__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="change-password-page__fields">
          <Input
            id="current-password"
            label={t("changePassword.currentPassword")}
            type={showCurrentPassword ? "text" : "password"}
            required
            maxLength={128}
            registration={register("currentPassword", { required: true, maxLength: 128 })}
            error={
              errors.currentPassword?.type === "required"
                ? tCommon("errors.required")
                : errors.currentPassword?.message
            }
            endIcon={
              <EyeToggleIcon
                showPassword={showCurrentPassword}
                onToggle={() => setShowCurrentPassword((prev) => !prev)}
              />
            }
          />

          <Input
            id="new-password"
            label={t("changePassword.newPassword")}
            type={showNewPassword ? "text" : "password"}
            required
            maxLength={128}
            registration={register("newPassword", {
              required: true,
              maxLength: 128,
              validate: {
                notSameAsCurrent: (value) =>
                  value !== getValues("currentPassword") ||
                  t("changePassword.errorSamePassword"),
                strongPassword: (value) =>
                  (hasMinLength(value) &&
                    hasUpperCase(value) &&
                    hasLowerCase(value) &&
                    hasNumber(value)) ||
                  tAuth("register.errors.passwordInvalid"),
              },
            })}
            error={
              errors.newPassword?.type === "required"
                ? tCommon("errors.required")
                : errors.newPassword
                  ? errors.newPassword.message
                  : undefined
            }
            endIcon={
              <EyeToggleIcon
                showPassword={showNewPassword}
                onToggle={() => setShowNewPassword((prev) => !prev)}
              />
            }
          />

          {newPassword.length > 0 && (
            <ul className="change-password-page__requirements">
              {requirements.map(({ met, label }) => (
                <li
                  key={label}
                  className={`change-password-page__requirements-item${met ? " change-password-page__requirements-item--met" : ""}`}
                >
                  {met ? (
                    <Icon name="check-bold" size={16} aria-hidden="true" />
                  ) : (
                    <span className="change-password-page__requirements-dot" aria-hidden="true" />
                  )}
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          )}

          <Input
            id="confirm-password"
            label={t("changePassword.confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            required
            maxLength={128}
            registration={register("confirmPassword", {
              required: true,
              maxLength: 128,
              validate: (value) => value === newPassword,
            })}
            error={
              errors.confirmPassword?.type === "required"
                ? tCommon("errors.required")
                : errors.confirmPassword?.type === "validate"
                  ? t("changePassword.errorMismatch")
                  : undefined
            }
            endIcon={
              <EyeToggleIcon
                showPassword={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((prev) => !prev)}
              />
            }
          />

          {submitState.error && (
            <p className="inline-error">
              <Icon name="error-circle" size={20} aria-hidden />
              {submitState.error}
            </p>
          )}
        </div>

        <Button
          text={t("changePassword.save")}
          type="submit"
          isLoading={submitState.isLoading}
        />
      </form>
    </div>
  );
};

export default ChangePasswordPage;
