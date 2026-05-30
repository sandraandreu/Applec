import "./input.scss";
import React, { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
  optional?: boolean;
  endIcon?: ReactNode;
  multiline?: boolean;
  disabled?: boolean;
  defaultValue?: string;
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
  optional,
  endIcon,
  multiline = false,
  disabled = false,
  defaultValue,
}: InputProps) => {
  const { t } = useTranslation("common");

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}{optional && <span className="field__optional"> ({t("fields.optional")})</span>}
      </label>
      <div className="field__input-wrapper">
        {multiline ? (
          <textarea
            id={id}
            placeholder={placeholder}
            className="field__input"
            maxLength={maxLength}
            defaultValue={defaultValue}
            {...(registration as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            disabled={disabled}
          />
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            className={`field__input${endIcon ? " field__input--with-icon" : ""}`}
            maxLength={maxLength}
            defaultValue={defaultValue}
            {...registration}
            disabled={disabled}
          />
        )}
        {!multiline && endIcon && <span className="field__icon">{endIcon}</span>}
      </div>
      {maxLength && currentLength !== undefined && currentLength >= Math.floor(maxLength * 0.8) && (
        <span className={`field__counter${currentLength >= maxLength ? " field__counter--warning" : ""}`}>
          {currentLength}/{maxLength}
        </span>
      )}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
};

export default Input;
