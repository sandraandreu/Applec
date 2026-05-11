import "./input.scss";
import React, { ReactNode } from "react";
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
  required?: boolean;
  endIcon?: ReactNode;
  multiline?: boolean;
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
  required,
  endIcon,
  multiline = false,
}: InputProps) => {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}{required && <span className="field__required"> *</span>}
      </label>
      <div className="field__input-wrapper">
        {multiline ? (
          <textarea
            id={id}
            placeholder={placeholder}
            className="field__input"
            {...(registration as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            className={`field__input${endIcon ? " field__input--with-icon" : ""}`}
            {...registration}
          />
        )}
        {!multiline && endIcon && <span className="field__icon">{endIcon}</span>}
      </div>
      {maxLength && (
        <span className="field__counter">
          {currentLength}/{maxLength}
        </span>
      )}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
};

export default Input;
