import "./search.scss";
import { useTranslation } from "react-i18next";
import Icon from "../icons/icon/Icon";

interface SearchProps {
  placeholder?: string;
  onChange: (value: string) => void;
}

const Search = ({ placeholder, onChange }: SearchProps) => {
  const { t } = useTranslation("common");

  return (
    <label className="search">
      <span className="visually-hidden">{placeholder ?? t("search.label")}</span>
      <Icon name="search" size={24} className="search__icon icon" />
      <input
        className="search__input"
        type="search"
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
};

export default Search;
