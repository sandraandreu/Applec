import "./Input.scss";

import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  placeholder?: string;
  type?: string;
  id?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  maxLength?: number;
  currentLength?: number;
}

const Input = ({
  label,
  placeholder,
  type = "text",
  id,
  error,
  registration,
  maxLength,
  currentLength,
}: InputProps) => {
  return (
    <>
      <div className="field">
        <label className="field__label" htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="field__input"
          {...registration}
        />
        {maxLength && <span className="field__counter">{currentLength}/{maxLength}</span>}
        {error && <span className="field__error">{error}</span>}
      </div>
    </>
  );
};

export default Input;
