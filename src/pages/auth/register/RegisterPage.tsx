import "./RegisterPage.scss";
import Register from "../../../components/auth/register/Register";
import BaseLayout from "../../../components/layout/baseLayout/BaseLayout";

const RegisterPage = () => {
  return (
    <BaseLayout>
      <Register />
    </BaseLayout>
  );
};

export default RegisterPage;
