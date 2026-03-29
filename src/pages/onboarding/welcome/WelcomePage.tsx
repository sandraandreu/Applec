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
