import "./LoginPage.scss";
import Login from "../../../components/auth/login/Login";
import BaseLayout from "../../../components/layout/baseLayout/BaseLayout";

const LoginPage = () => {
  return (
    <BaseLayout>
      <Login />
    </BaseLayout>
  );
};

export default LoginPage;
