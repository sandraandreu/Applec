import { IonButton } from "@ionic/react";
import "./RegisterForm.scss";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  hasMinLength,
  hasUpperCase,
  hasLowerCase,
  hasNumber,
} from "../Register";

//Types

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  emailInvalidMessage: string;
  isEmailValid: boolean;
  isPasswordValid: boolean;
}

interface RegisterFormActions {
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  emailVerification: (value: string) => void;
  passwordVerification: (value: string) => void;
  handleRegister: () => void;
}

interface RegisterFormProps {
  state: RegisterFormState;
  actions: RegisterFormActions;
}

//Component

const RegisterForm = ({ state, actions }: RegisterFormProps) => {
  const [acceptsTerms, setAcceptsTerms] = useState<boolean>(false);

  const { t } = useTranslation();

  const {
    name,
    email,
    password,
    emailInvalidMessage,
    isEmailValid,
    isPasswordValid,
  } = state;
  const {
    setName,
    setEmail,
    setPassword,
    emailVerification,
    passwordVerification,
    handleRegister,
  } = actions;

  return (
    <>
      <h1>{t("register_title")}</h1>
      <form>
        <label htmlFor="register-name">{t("register_name")}</label>
        <input
          id="register-name"
          type="text"
          value={name}
          placeholder={t("register_name_placeholder")}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="register-email">{t("register_email")}</label>
        <input
          id="register-email"
          type="email"
          value={email}
          placeholder={t("register_email_placeholder")}
          onChange={(e) => {
            setEmail(e.target.value);
            emailVerification(e.target.value);
          }}
        />
        {emailInvalidMessage}

        <label htmlFor="register-password">{t("register_password")}</label>
        <input
          id="register-password"
          type="password"
          value={password}
          placeholder={t("register_password_placeholder")}
          onChange={(e) => {
            setPassword(e.target.value);
            passwordVerification(e.target.value);
          }}
        />

        {/*cambiar los checkbox por imagenes que cambian */}
        <div>
          <input type="checkbox" checked={hasMinLength(state.password)} />
          <span>{t("register_password_min_length")}</span>
          <input type="checkbox" checked={hasUpperCase(state.password)} />
          <span>{t("register_password_uppercase")}</span>
          <input type="checkbox" checked={hasLowerCase(state.password)} />
          <span>{t("register_password_lowercase")}</span>
          <input type="checkbox" checked={hasNumber(state.password)} />
          <span>{t("register_password_number")}</span>
        </div>

        <input
          id="register-terms"
          type="checkbox"
          checked={acceptsTerms}
          onChange={(e) => setAcceptsTerms(e.target.checked)}
        />
        <label htmlFor="register-terms">
          {t("register_terms_start")}
          <a href="/privacy">{t("register_terms_privacy")}</a>
          {t("register_terms_and")}
          <a href="/terms">{t("register_terms_conditions")}</a>
        </label>

        <IonButton
          disabled={
            !name ||
            !email ||
            !isEmailValid ||
            !isPasswordValid ||
            !acceptsTerms
          }
          onClick={handleRegister}
        >
          {t("register_button")}
        </IonButton>
        <a href="">{t("register_login_link")}</a>
      </form>
    </>
  );
};

export default RegisterForm;
