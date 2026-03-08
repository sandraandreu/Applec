import { IonButton } from "@ionic/react";
import "./RegisterForm.scss";
import { useTranslation } from "react-i18next";

//Types

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  emailInvalidMessage: string;
  isEmailValid: boolean;
  isPasswordValid: boolean;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
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

  const { t } = useTranslation();

  const { name, email, password, emailInvalidMessage, isEmailValid, isPasswordValid, hasMinLength, hasUpperCase, hasLowerCase, hasNumber } = state;
  const { setName, setEmail, setPassword, emailVerification, passwordVerification, handleRegister } = actions;


  return (
    <>
      <h1>{t("register_title")}</h1>
      <form>
        <label>{t("register_name")}</label>
        <input
          type="text"
          value={name}
          placeholder={t("register_name_placeholder")}
          onChange={(e) => setName(e.target.value)}
        />

        <label>{t("register_email")}</label>
        <input
          type="email"
          value={email}
          placeholder={t("register_email_placeholder")}
          onChange={(e) => {
            setEmail(e.target.value);
            emailVerification(e.target.value);
          }}
        />
        {emailInvalidMessage}

        <label>{t("register_password")}</label>
        <input
          type="password"
          value={password}
          placeholder={t("register_password_placeholder")}
          onChange={(e) => {
            setPassword(e.target.value);
            passwordVerification(e.target.value);
          }}
        />
        <div>
          <div>
            <input type="checkbox" checked={hasMinLength} />
            <span>{t("register_password_min_length")}</span>
          </div>
          <div>
            <input type="checkbox" checked={hasUpperCase} />
            <span>{t("register_password_uppercase")}</span>
          </div>
          <div>
            <input type="checkbox" checked={hasLowerCase} />
            <span>{t("register_password_lowercase")}</span>
          </div>
          <div>
            <input type="checkbox" checked={hasNumber} />
            <span>{t("register_password_number")}</span>
          </div>
        </div>

        <IonButton
          disabled={!name || !email || !isEmailValid || !isPasswordValid}
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