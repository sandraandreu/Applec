import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button className="back-button" type="button" onClick={() => navigate(-1)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M11.4375 18.7522L4.68747 12.0022L11.4375 5.2522M5.62497 12.0022H19.3125" stroke="#7D7D7D" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

export default BackButton;
