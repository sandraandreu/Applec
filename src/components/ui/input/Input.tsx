import "./Input.scss";

import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  placeholder?: string;
  type?: string;
  id?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
}

const Input = ({
  label,
  placeholder,
  type = "text",
  id,
  error,
  registration,
}: InputProps) => {
  return (
    <>
      <div>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...registration}
        />
        {error && <span>{error}</span>}
      </div>
    </>
  );
};

export default Input;
