import "./Register.scss";
import { useIonRouter } from "@ionic/react";
import { useTranslation } from "react-i18next";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "../../../plugins/firebase";
import { useState, useEffect } from "react";
import RegisterForm from "./RegisterForm";
import RegisterSuccess from "./RegisterSuccess";
import RegisterError from "./RegisterError";

const auth = getAuth(app);
const db = getFirestore(app);

const Register = () => {
  const { t } = useTranslation();
  const router = useIonRouter();

  const [registerState, setRegisterState] = useState<
    "form" | "success" | "error"
  >("form");

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [emailInvalidMessage, setEmailInvalidMessage] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [hasMinLength, setHasMinLength] = useState<boolean>(false);
  const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
  const [hasLowerCase, setHasLowerCase] = useState<boolean>(false);
  const [hasNumber, setHasNumber] = useState<boolean>(false);

  const [user, setUser] = useState<any>(null);

  //Verificaciones de email y contraseña

  const emailVerification = (value: string) => {
    if (!value) {
      setEmailInvalidMessage("");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(value));

    if (isEmailValid) {
      console.log("Valid Email Address");
      setEmailInvalidMessage("");
    } else {
      console.log("Invalid Email Address");
      setEmailInvalidMessage(t("register_error_email_invalid"));
    }
  };

  const passwordVerification = (value: string) => {
    if (!value) {
      setIsPasswordValid(false);
      setHasMinLength(false);
      setHasUpperCase(false);
      setHasLowerCase(false);
      setHasNumber(false);
      return;
    }

    setHasMinLength(value.length >= 6);
    setHasUpperCase(/[A-Z]/.test(value));
    setHasLowerCase(/[a-z]/.test(value));
    setHasNumber(/[0-9]/.test(value));

    const isPasswordValid =
      value.length >= 6 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value);

    if (isPasswordValid) {
      console.log("Valid Password");
      setIsPasswordValid(true);
    } else {
      console.log("Invalid Password");
      setIsPasswordValid(false);
    }
  };

  //Crear user en firebase

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      setRegisterState("success");
      setUser(userCredential.user);
      await sendEmailVerification(userCredential.user);
    } catch (error: any) {
      setRegisterState("error");
      console.error("Email sign up error:", error.message);
    }
  };

  const handleResendEmail = async () => {
    if (user) {
      await sendEmailVerification(user);
    }
  };

  //Comprobar si ha verificado el email y guardar el user en firebase

  useEffect(() => {
  if (!user) return;

  const interval = setInterval(async () => {
    await user.reload();
    if (user.emailVerified) {
      clearInterval(interval);
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: user.email,
          createdAt: new Date(),
          role: "member",
        });
        router.push("/home");
      } catch (error: any) {
        console.error("Error guardando usuario:", error.message);
      }
    }
  }, 3000);

  return () => clearInterval(interval);
}, [user]);

  //Estados y acciones del formulario

  const formState = {
    name,
    email,
    password,
    emailInvalidMessage,
    isEmailValid,
    isPasswordValid,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
  };

  const formActions = {
    setName,
    setEmail,
    setPassword,
    emailVerification,
    passwordVerification,
    handleRegister,
  };

  return (
    <>
      {registerState === "success" ? (
        <RegisterSuccess
          handleResendEmail={handleResendEmail}
          onBack={() => setRegisterState("form")}
        />
      ) : registerState === "error" ? (
        <RegisterError onBack={() => setRegisterState("form")} />
      ) : (
        <RegisterForm state={formState} actions={formActions} />
      )}
    </>
  );
};

export default Register;

//Mientras el usuario escribe:
//ok Si el email no tiene formato válido → mensaje de error en tiempo real
//ok Si la contraseña no cumple requisitos → mensaje de error en tiempo real
//ok Si todos los campos están rellenos y son válidos → botón activo
//ok Si algún campo está vacío o inválido → botón deshabilitado

//Al hacer click en registrarse:
//Llamar a Firebase para crear el usuario
//Si el email ya existe, Firebase nos devuelve un error → mostramos mensaje
//Si todo va bien, enviamos el email de verificación
//Cada x tiempo comprobar si el correo ha sido verificado (Mensaje al usuario de lo que esta pasando)
//Si el correo se verifica
//Se guarda el usuario en firebase
//Se inicia sesion a la app
