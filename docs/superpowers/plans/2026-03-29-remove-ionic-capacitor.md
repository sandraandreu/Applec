# Remove Ionic & Capacitor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all Ionic and Capacitor dependencies, replacing Ionic components with plain HTML + SCSS.

**Architecture:** In-place migration — replace Ionic wrappers with semantic HTML elements, swap Ionic router with standard react-router-dom, rewrite Alert and Loading components from scratch with HTML + CSS.

**Tech Stack:** React 18, React Router v5, SCSS, TypeScript

---

### Task 1: Replace Ionic router with standard react-router-dom

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/routes/appRoutes/AppRoutes.tsx`

- [ ] **Step 1: Rewrite App.tsx**

Replace the entire file content with:

```tsx
import React from "react";
import "./App.scss";
import AppRoutes from "./routes/appRoutes/AppRoutes";
import { AuthContextProvider } from "./context/auth/AuthContextProvider";

const App: React.FC = () => (
  <AuthContextProvider>
    <div className="app">
      <AppRoutes />
    </div>
  </AuthContextProvider>
);

export default App;
```

- [ ] **Step 2: Rewrite AppRoutes.tsx**

Replace the entire file content with:

```tsx
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

import Home from "../../pages/home/Home";
import LoginPage from "../../pages/auth/login/LoginPage";
import RegisterPage from "../../pages/auth/register/RegisterPage";
import ForgotPasswordPage from "../../pages/auth/forgotPassword/ForgotPasswordPage";
import CreateGroupPage from "../../pages/groups/createGroup/CreateGroupPage";
import WelcomePage from "../../pages/onboarding/welcome/WelcomePage";
import GroupPage from "../../pages/onboarding/group/GroupPage";
import LanguagePage from "../../pages/onboarding/language/LanguagePage";

const AppRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/home" />} />

      <Route
        exact
        path="/home"
        render={() => (
          <PrivateRoutes>
            <Home />
          </PrivateRoutes>
        )}
      />

      <Route
        exact
        path="/register"
        render={() => (
          <PublicRoutes>
            <RegisterPage />
          </PublicRoutes>
        )}
      />

      <Route
        exact
        path="/login"
        render={() => (
          <PublicRoutes>
            <LoginPage />
          </PublicRoutes>
        )}
      />

      <Route
        exact
        path="/forgot-password"
        render={() => (
          <PublicRoutes>
            <ForgotPasswordPage />
          </PublicRoutes>
        )}
      />

      <Route
        exact
        path="/onboarding/welcome"
        render={() => (
          <PrivateRoutes>
            <WelcomePage />
          </PrivateRoutes>
        )}
      />

      <Route
        exact
        path="/onboarding/language"
        render={() => (
          <PrivateRoutes>
            <LanguagePage />
          </PrivateRoutes>
        )}
      />

      <Route
        exact
        path="/onboarding/group"
        render={() => (
          <PrivateRoutes>
            <GroupPage />
          </PrivateRoutes>
        )}
      />

      <Route
        exact
        path="/create-group"
        render={() => (
          <PrivateRoutes>
            <CreateGroupPage />
          </PrivateRoutes>
        )}
      />
    </Switch>
  </BrowserRouter>
);

export default AppRoutes;
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx src/routes/appRoutes/AppRoutes.tsx
git commit -m "refactor: replace Ionic router with standard react-router-dom"
```

---

### Task 2: Migrate all pages from IonPage/IonContent to plain HTML

**Files:**
- Modify: `src/pages/home/Home.tsx`
- Modify: `src/pages/onboarding/welcome/WelcomePage.tsx`
- Modify: `src/pages/onboarding/language/LanguagePage.tsx`
- Modify: `src/pages/onboarding/group/GroupPage.tsx`
- Modify: `src/pages/groups/createGroup/CreateGroupPage.tsx`
- Modify: `src/pages/auth/login/LoginPage.tsx`
- Modify: `src/pages/auth/register/RegisterPage.tsx`
- Modify: `src/pages/auth/forgotPassword/ForgotPasswordPage.tsx`

- [ ] **Step 1: Rewrite Home.tsx**

Replace the entire file content with:

```tsx
import "./Home.scss";
import { useTranslation } from "react-i18next";
import Alert from "../../components/feedback/alerts/Alert";
import { useState } from "react";
import { useAuthContext } from "../../context/auth/AuthContext";
import LanguageSelector from "../../components/ui/language/LanguageSelector";

const Home = () => {
  const { logout } = useAuthContext();
  const { t } = useTranslation();
  const [testAlert, setTestAlert] = useState<"header" | "alert">("alert");

  return (
    <div className="page">
      <main className="page-content">
        <header className="toolbar">
          <h1>{t("bienvenida")}</h1>
          <button onClick={logout}>Logout</button>
          <LanguageSelector />
        </header>
      </main>
    </div>
  );
};

export default Home;
```

- [ ] **Step 2: Rewrite WelcomePage.tsx**

Replace the entire file content with:

```tsx
import "./WelcomePage.scss";
import Welcome from "../../../components/onboarding/welcome/Welcome";

const WelcomePage = () => {
  return (
    <div className="page">
      <main className="page-content">
        <Welcome />
      </main>
    </div>
  );
};

export default WelcomePage;
```

- [ ] **Step 3: Rewrite LanguagePage.tsx**

Replace the entire file content with:

```tsx
import "./LanguagePage.scss";
import Language from "../../../components/onboarding/language/Language";

const LanguagePage = () => {
  return (
    <div className="page">
      <main className="page-content">
        <Language />
      </main>
    </div>
  );
};

export default LanguagePage;
```

- [ ] **Step 4: Rewrite GroupPage.tsx**

Replace the entire file content with:

```tsx
import "./GroupPage.scss";
import Group from "../../../components/onboarding/group/Group";

const GroupPage = () => {
  return (
    <div className="page">
      <main className="page-content">
        <Group />
      </main>
    </div>
  );
};

export default GroupPage;
```

- [ ] **Step 5: Rewrite CreateGroupPage.tsx**

Replace the entire file content with:

```tsx
import "./CreateGroupPage.scss";
import CreateGroup from "../../../components/groups/createGroup/CreateGroup";

const CreateGroupPage = () => {
  return (
    <div className="page">
      <main className="page-content">
        <CreateGroup />
      </main>
    </div>
  );
};

export default CreateGroupPage;
```

- [ ] **Step 6: Rewrite LoginPage.tsx**

Replace the entire file content with:

```tsx
import "./LoginPage.scss";
import Login from "../../../components/auth/login/Login";

const LoginPage = () => {
  return (
    <div className="page">
      <main className="page-content">
        <Login />
      </main>
    </div>
  );
};

export default LoginPage;
```

- [ ] **Step 7: Rewrite RegisterPage.tsx**

Replace the entire file content with:

```tsx
import "./RegisterPage.scss";
import Register from "../../../components/auth/register/Register";

const RegisterPage = () => {
  return (
    <div className="page">
      <main className="page-content">
        <Register />
      </main>
    </div>
  );
};

export default RegisterPage;
```

- [ ] **Step 8: Rewrite ForgotPasswordPage.tsx**

Replace the entire file content with:

```tsx
import "./ForgotPasswordPage.scss";
import ForgotPassword from "../../../components/auth/forgotPassword/ForgotPassword";

const ForgotPasswordPage = () => {
  return (
    <div className="page">
      <main className="page-content">
        <ForgotPassword />
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
```

- [ ] **Step 9: Commit**

```bash
git add src/pages/
git commit -m "refactor: replace IonPage/IonContent with plain HTML in all pages"
```

---

### Task 3: Replace useIonRouter with useHistory in all components

**Files:**
- Modify: `src/components/onboarding/welcome/Welcome.tsx`
- Modify: `src/components/onboarding/language/Language.tsx`
- Modify: `src/components/auth/login/Login.tsx`
- Modify: `src/components/auth/register/Register.tsx`
- Modify: `src/components/auth/forgotPassword/ForgotPassword.tsx`

- [ ] **Step 1: Update Welcome.tsx**

Replace the import and usage:

```tsx
// Old:
import { useIonRouter } from "@ionic/react";
const router = useIonRouter();
router.push("/onboarding/language");

// New:
import { useHistory } from "react-router-dom";
const history = useHistory();
history.push("/onboarding/language");
```

Full file:

```tsx
import "./Welcome.scss";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useAuthContext } from "../../../context/auth/AuthContext";

const Welcome = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const history = useHistory();
  const { userName } = useAuthContext();

  return (
    <>
      <h1>{t("welcome.title", { name: userName })}</h1>
      <p>{t("welcome.subtitle")}</p>
      <p>{t("welcome.description")}</p>
      <button onClick={() => history.push("/onboarding/language")}>{tc("buttons.start")}</button>
    </>
  );
};

export default Welcome;
```

- [ ] **Step 2: Update Language.tsx**

Full file:

```tsx
import { useHistory } from "react-router-dom";
import LanguageSelector from "../../ui/language/LanguageSelector";
import "./Language.scss";
import { useTranslation } from "react-i18next";

const Language = () => {
  const { t } = useTranslation("onboarding");
  const { t: tc } = useTranslation("common");
  const history = useHistory();

  return (
    <>
      <h1>{t("language.title")}</h1>
      <p>{t("language.description")}</p>
      <LanguageSelector />
      <button onClick={() => history.push("/onboarding/group")}>{tc("buttons.continue")}</button>
    </>
  );
};

export default Language;
```

- [ ] **Step 3: Update Login.tsx**

Replace the import and all usages:

```tsx
// Old:
import { useIonRouter } from "@ionic/react";
const router = useIonRouter();
router.push("/onboarding/welcome");

// New:
import { useHistory } from "react-router-dom";
const history = useHistory();
history.push("/onboarding/welcome");
```

Full file:

```tsx
import "./Login.scss";
import { useTranslation } from "react-i18next";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import app from "../../../plugins/firebase";
import Alert from "../../feedback/alerts/Alert";
import Loading from "../../feedback/loading/Loading";
import Button from "../../ui/button/Button";
import Input from "../../ui/input/Input";

const auth = getAuth(app);

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const history = useHistory();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginState, setLoginState] = useState<"form" | "unverified">("form");
  const [user, setUser] = useState<any>(null);
  const [errorConnection, setErrorConnection] = useState<string>("");
  const [errorCredentials, setErrorCredentials] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data.email, data.password);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      setUser(userCredential.user);

      if (!userCredential.user.emailVerified) {
        setLoginState("unverified");
        setIsLoading(false)
        return;
      }
      setIsLoading(false);
      history.push("/onboarding/welcome");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setErrorCredentials(t("login.errors.invalidCredentials"));
        setIsLoading(false);
        return;
      }
      if (error.code === "auth/network-request-failed") {
        setErrorConnection(tc("errors.noConnection"));
        setIsLoading(false);
        return;
      }
      console.error("Email sign up error:", error.message);
    }
  };

  const handleResendEmail = async () => {
    if (user) {
      await sendEmailVerification(user);
    }
  };

  return (
    <>
      {isLoading && <Loading />}

      <h1>{t("login.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="login-email"
          label={tc("fields.email")}
          placeholder={t("login.emailPlaceholder")}
          type="text"
          registration={register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
          error={
            errors.email?.type === "required"
              ? tc("errors.required")
              : errors.email?.type === "pattern"
                ? tc("errors.emailInvalid")
                : undefined
          }
        />

        <Input
          id="login-password"
          label={tc("fields.password")}
          placeholder={t("login.passwordPlaceholder")}
          type="password"
          registration={register("password", { required: true })}
          error={
            errors.password?.type === "required"
              ? tc("errors.required")
              : undefined
          }
        />

        <Button
          text={t("login.button")}
          type="submit"
          disabled={Object.keys(errors).length > 0}
          isLoading={isLoading}
        />

        {errorConnection && <span>{errorConnection}</span>}
        {errorCredentials && <span>{errorCredentials}</span>}

        <a href="/register">{t("login.registerLink")}</a>
        <a href="/forgot-password">{t("login.forgotPassword")}</a>
      </form>

      <Alert
        isOpen={loginState === "unverified"}
        header={t("login.errors.emailNotVerifiedTitle")}
        message={t("login.errors.emailNotVerified")}
        onDismiss={() => setLoginState("form")}
        buttons={[
          {
            text: tc("buttons.resendEmail"),
            handler: () => handleResendEmail(),
          },
          {
            text: tc("buttons.close"),
            role: "cancel",
          },
        ]}
      />
    </>
  );
};

export default Login;
```

- [ ] **Step 4: Update Register.tsx**

Replace the import and all usages:

```tsx
// Old:
import { useIonRouter } from "@ionic/react";
const router = useIonRouter();
router.push("/login");

// New:
import { useHistory } from "react-router-dom";
const history = useHistory();
history.push("/login");
```

Full file:

```tsx
import "./Register.scss";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import app from "../../../plugins/firebase";
import { useState } from "react";
import Alert from "../../feedback/alerts/Alert";
import Loading from "../../feedback/loading/Loading";
import Button from "../../ui/button/Button";
import Input from "../../ui/input/Input";

const auth = getAuth(app);
const db = getFirestore(app);

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptsTerms: boolean;
}

const hasMinLength = (value: string) => value.length >= 6;
const hasUpperCase = (value: string) => /[A-Z]/.test(value);
const hasLowerCase = (value: string) => /[a-z]/.test(value);
const hasNumber = (value: string) => /[0-9]/.test(value);

const Register = () => {
  const history = useHistory();
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registerState, setRegisterState] = useState<
    "form" | "success" | "error"
  >("form");
  const [user, setUser] = useState<any>(null);
  const [usernameError, setUsernameError] = useState<string>("");
  const [errorConnection, setErrorConnection] = useState<string>("");

  const handleRegister = async (
    email: string,
    password: string,
    userName: string,
  ) => {
    try {
      setIsLoading(true);
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("userName", "==", userName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("username-already-exists");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      setUser(userCredential.user);

      await sendEmailVerification(userCredential.user);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        userName: userName,
        email: userCredential.user.email,
        createdAt: new Date(),
        role: "member",
      });

      await signOut(auth);
      setRegisterState("success");
    } catch (error: any) {
      console.error("Error completo:", error);
      console.error("Código:", error.code);
      console.error("Mensaje:", error.message);
      if (error.message === "username-already-exists") {
        setUsernameError(t("register.errors.usernameTaken"));
        return;
      }
      if (error.code === "auth/network-request-failed") {
        setErrorConnection(tc("errors.noConnection"));
        return;
      }
      setRegisterState("error");
      console.error("Email sign up error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (user) {
      await sendEmailVerification(user);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password", "");

  const onSubmit = (data: RegisterFormData) => {
    handleRegister(data.email, data.password, data.username);
  };

  return (
    <>
      {isLoading && <Loading />}

      <h1>{t("register.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="register-username"
          label={t("register.username")}
          placeholder={t("register.usernamePlaceholder")}
          type="text"
          registration={register("username", { required: true })}
          error={
            errors.username?.type === "required"
              ? tc("errors.required")
              : usernameError
                ? usernameError
                : undefined
          }
        />

        <Input
          id="register-email"
          label={tc("fields.email")}
          placeholder={t("register.emailPlaceholder")}
          type="text"
          registration={register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
          error={
            errors.email?.type === "required"
              ? tc("errors.required")
              : errors.email?.type === "pattern"
                ? tc("errors.emailInvalid")
                : undefined
          }
        />

        <Input
          id="register-password"
          label={tc("fields.password")}
          placeholder={t("register.passwordPlaceholder")}
          type="password"
          registration={register("password", {
            required: true,
            validate: (value) =>
              hasMinLength(value) &&
              hasUpperCase(value) &&
              hasLowerCase(value) &&
              hasNumber(value),
          })}
          error={
            errors.password?.type === "required"
              ? tc("errors.required")
              : undefined
          }
        />

        <div>
          <input type="checkbox" readOnly checked={hasMinLength(password)} />
          <span>{t("register.passwordMinLength")}</span>
          <input type="checkbox" readOnly checked={hasUpperCase(password)} />
          <span>{t("register.passwordUppercase")}</span>
          <input type="checkbox" readOnly checked={hasLowerCase(password)} />
          <span>{t("register.passwordLowercase")}</span>
          <input type="checkbox" readOnly checked={hasNumber(password)} />
          <span>{t("register.passwordNumber")}</span>
        </div>

        <Input
          id="register-confirm-password"
          label={t("register.confirmPassword")}
          placeholder={t("register.confirmPasswordPlaceholder")}
          type="password"
          registration={register("confirmPassword", {
            required: true,
            validate: (value) => value === password,
          })}
          error={
            errors.confirmPassword?.type === "required"
              ? tc("errors.required")
              : errors.confirmPassword?.type === "validate"
                ? t("register.errors.passwordMismatch")
                : undefined
          }
        />

        <input
          id="acceptsTerms"
          type="checkbox"
          {...register("acceptsTerms", { required: true })}
        />
        <label htmlFor="acceptsTerms">
          {t("register.termsStart")}
          <a href="/privacy">{t("register.termsPrivacy")}</a>
          {t("register.termsAnd")}
          <a href="/terms">{t("register.termsConditions")}</a>
        </label>

        {errors.acceptsTerms?.type === "required" && (
          <span>{t("register.errors.termsRequired")}</span>
        )}

        <Button
          text={t("register.button")}
          type="submit"
          disabled={Object.keys(errors).length > 0}
          isLoading={isLoading}
        />

        {errorConnection && <span>{errorConnection}</span>}

        <a href="/login">{t("register.loginLink")}</a>
      </form>

      <Alert
        isOpen={registerState === "error"}
        header={t("register.errors.emailTaken")}
        onDismiss={() => setRegisterState("form")}
        buttons={[
          {
            text: tc("buttons.close"),
            role: "cancel",
          },
          {
            text: t("register.errors.emailTakenButton"),
            handler: () => history.push("/login"),
          },
        ]}
      />

      <Alert
        isOpen={registerState === "success"}
        header={t("register.verifyTitle")}
        message={t("register.verifyMessage")}
        onDismiss={() => history.push("/login")}
        buttons={[
          {
            text: tc("buttons.resendEmail"),
            handler: () => handleResendEmail(),
          },
          {
            text: tc("buttons.close"),
            role: "cancel",
          },
        ]}
      />
    </>
  );
};

export default Register;
```

- [ ] **Step 5: Update ForgotPassword.tsx**

Full file:

```tsx
import "./ForgotPassword.scss";
import { useTranslation } from "react-i18next";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import app from "../../../plugins/firebase";
import Alert from "../../feedback/alerts/Alert";
import { useHistory } from "react-router-dom";
import Loading from "../../feedback/loading/Loading";
import Button from "../../ui/button/Button";
import Input from "../../ui/input/Input";

const auth = getAuth(app);

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword = () => {
  const { t } = useTranslation("auth");
  const { t: tc } = useTranslation("common");
  const history = useHistory();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [forgotPasswordState, setForgotPasswordState] = useState<
    "form" | "success"
  >("form");
  const [errorConnection, setErrorConnection] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = (data: ForgotPasswordFormData) => {
    handleForgotPassword(data.email);
  };

  const handleForgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      setForgotPasswordState("success");
    } catch (error: any) {
      if (error.code === "auth/network-request-failed") {
        setErrorConnection(tc("errors.noConnection"));
        return;
      }
      console.error("Forgot password error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}

      <h1>{t("forgotPassword.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="forgot_password-email"
          label={tc("fields.email")}
          placeholder={t("forgotPassword.emailPlaceholder")}
          type="text"
          registration={register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
          error={
            errors.email?.type === "required"
              ? tc("errors.required")
              : errors.email?.type === "pattern"
                ? tc("errors.emailInvalid")
                : undefined
          }
        />

        <Button
          text={t("forgotPassword.button")}
          type="submit"
          disabled={Object.keys(errors).length > 0}
          isLoading={isLoading}
        />

        <a href="/login">{t("forgotPassword.back")}</a>

        {errorConnection && <span>{errorConnection}</span>}
      </form>

      <Alert
        isOpen={forgotPasswordState === "success"}
        header={t("forgotPassword.successTitle")}
        message={t("forgotPassword.successMessage")}
        onDismiss={() => setForgotPasswordState("form")}
        buttons={[
          {
            text: t("forgotPassword.back"),
            handler: () => history.push("/login"),
          },
        ]}
      />
    </>
  );
};

export default ForgotPassword;
```

- [ ] **Step 6: Commit**

```bash
git add src/components/onboarding/ src/components/auth/
git commit -m "refactor: replace useIonRouter with useHistory in all components"
```

---

### Task 4: Rewrite Alert component with native dialog element

**Files:**
- Modify: `src/components/feedback/alerts/Alert.tsx`
- Modify: `src/components/feedback/alerts/Alert.scss`

- [ ] **Step 1: Rewrite Alert.tsx**

Replace the entire file content with:

```tsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./Alert.scss";

interface AlertProps {
  isOpen: boolean;
  header?: string;
  message?: string;
  onDismiss: () => void;
  buttons: {
    text: string;
    role?: string;
    handler?: () => void;
  }[];
}

const Alert = ({
  isOpen,
  header,
  message,
  onDismiss,
  buttons,
}: AlertProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleButtonClick = (button: AlertProps["buttons"][number]) => {
    button.handler?.();
    onDismiss();
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className="alert"
      onClose={onDismiss}
    >
      <div className="alert__content">
        {header && <h2 className="alert__header">{header}</h2>}
        {message && <p className="alert__message">{message}</p>}
        <div className="alert__buttons">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`alert__button ${button.role === "cancel" ? "alert__button--cancel" : ""}`}
              onClick={() => handleButtonClick(button)}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </dialog>,
    document.body
  );
};

export default Alert;
```

- [ ] **Step 2: Write Alert.scss**

Replace the entire file content with:

```scss
.alert {
  border: none;
  border-radius: 8px;
  padding: 0;
  max-width: 400px;
  width: 90%;

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.4);
  }

  &__content {
    padding: 24px;
  }

  &__header {
    margin: 0 0 8px;
    font-size: 1.125rem;
    font-weight: 600;
  }

  &__message {
    margin: 0 0 20px;
    color: #666;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  &__button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: #3880ff;
    color: #fff;

    &--cancel {
      background-color: transparent;
      color: #666;
    }

    &:hover {
      opacity: 0.85;
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/feedback/alerts/
git commit -m "refactor: replace IonAlert with native dialog element"
```

---

### Task 5: Rewrite Loading component with CSS spinner

**Files:**
- Modify: `src/components/feedback/loading/Loading.tsx`
- Modify: `src/components/feedback/loading/Loading.scss`

- [ ] **Step 1: Rewrite Loading.tsx**

Replace the entire file content with:

```tsx
import "./Loading.scss";

interface LoadingProps {
  message?: string;
}

const Loading = ({ message }: LoadingProps) => {
  return (
    <div className="loading">
      <div className="loading__spinner" />
      {message && <p className="loading__message">{message}</p>}
    </div>
  );
};

export default Loading;
```

- [ ] **Step 2: Write Loading.scss**

Replace the entire file content with:

```scss
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &__spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e0e0e0;
    border-top-color: #3880ff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &__message {
    margin: 0;
    font-size: 0.875rem;
    color: #666;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/feedback/loading/
git commit -m "refactor: replace IonSpinner with CSS-only spinner"
```

---

### Task 6: Add base layout styles

**Files:**
- Modify: `src/styles/base/_site.scss`

- [ ] **Step 1: Add layout classes to _site.scss**

Replace the entire file content with:

```scss
body {
  margin: 0;
  min-height: 100vh;
}

html {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

.app {
  min-height: 100vh;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding: 16px;
}

.toolbar {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/base/_site.scss
git commit -m "refactor: add base layout styles for page/toolbar classes"
```

---

### Task 7: Clean up styles — remove Ionic theme

**Files:**
- Delete: `src/styles/ionic-theme/_ionic-variables.css`
- Delete: `src/styles/ionic-theme/` directory

- [ ] **Step 1: Delete Ionic theme directory**

```bash
rm -rf src/styles/ionic-theme/
```

- [ ] **Step 2: Commit**

```bash
git add -A src/styles/ionic-theme/
git commit -m "refactor: remove Ionic theme variables"
```

---

### Task 8: Clean up public/index.html

**Files:**
- Modify: `public/index.html`

- [ ] **Step 1: Update index.html**

Replace the entire file content with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Applec</title>

    <base href="/" />

    <meta name="color-scheme" content="light dark" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link rel="shortcut icon" type="image/png" href="%PUBLIC_URL%/assets/icon/favicon.png" />

    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="Applec" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  </head>

  <body>
    <div id="root"></div>
  </body>

</html>
```

- [ ] **Step 2: Commit**

```bash
git add public/index.html
git commit -m "refactor: clean up index.html — remove Ionic-specific meta tags"
```

---

### Task 9: Delete Capacitor and Ionic config files

**Files:**
- Delete: `capacitor.config.ts`
- Delete: `ionic.config.json`
- Delete: `android/` directory
- Delete: `ios/` directory

- [ ] **Step 1: Delete config files and native directories**

```bash
rm capacitor.config.ts ionic.config.json
rm -rf android/ ios/
```

- [ ] **Step 2: Commit**

```bash
git add -A capacitor.config.ts ionic.config.json android/ ios/
git commit -m "refactor: remove Capacitor config and native platform directories"
```

---

### Task 10: Remove Ionic/Capacitor dependencies from package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Uninstall Ionic and Capacitor packages**

```bash
npm uninstall @ionic/react @ionic/react-router @capacitor/core @capacitor/android @capacitor/ios ionicons
npm uninstall -D @capacitor/cli
```

- [ ] **Step 2: Clean up package.json**

Remove the `overrides` block (only exists for `@stencil/core` which was an Ionic dependency):

```json
// Remove this entire block:
"overrides": {
  "@stencil/core": "4.1.0"
},
```

Update the `test` script to remove Ionic-specific transform ignore patterns:

```json
// Old:
"test": "react-scripts test --transformIgnorePatterns 'node_modules/(?!(@ionic/react|@ionic/react-router|@ionic/core|@stencil/core|ionicons)/)'",

// New:
"test": "react-scripts test",
```

Remove the Capacitor scripts:

```json
// Remove:
"sync-android": "npx cap sync android",
"open-android": "npx cap open android"
```

Update the description:

```json
// Old:
"description": "An Ionic project"

// New:
"description": "Applec web application"
```

- [ ] **Step 3: Run npm install to regenerate lockfile**

```bash
npm install
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "refactor: remove Ionic/Capacitor dependencies and clean up scripts"
```

---

### Task 11: Verify build

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Expected: Build completes with no errors. No references to `@ionic/*` or `@capacitor/*` remain.

- [ ] **Step 2: Verify no Ionic/Capacitor imports remain**

```bash
grep -r "@ionic" src/ || echo "No @ionic imports found"
grep -r "@capacitor" src/ || echo "No @capacitor imports found"
grep -r "ionicons" src/ || echo "No ionicons imports found"
```

Expected: All three commands print "No ... imports found".

- [ ] **Step 3: Commit build fix if needed, otherwise done**

If the build fails, fix any remaining Ionic references and commit. If it passes, the migration is complete.
