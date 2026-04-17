import "./search.scss";

interface SearchProps {
  placeholder?: string;
  onChange: (value: string) => void;
}

const Search = ({ placeholder, onChange }: SearchProps) => {
  return (
    <div className="search">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M10.3636 2.99701C8.90722 2.99701 7.48354 3.42888 6.2726 4.238C5.06167 5.04712 4.11786 6.19716 3.56052 7.54268C3.00319 8.8882 2.85737 10.3688 3.14149 11.7972C3.42562 13.2256 4.12693 14.5376 5.15675 15.5675C6.18657 16.5973 7.49863 17.2986 8.92703 17.5827C10.3554 17.8668 11.836 17.721 13.1815 17.1637C14.527 16.6063 15.6771 15.6625 16.4862 14.4516C17.2953 13.2407 17.7272 11.817 17.7272 10.3606C17.7271 8.40769 16.9512 6.53481 15.5703 5.15389C14.1894 3.77298 12.3165 2.99713 10.3636 2.99701V2.99701Z"
          stroke="#4C4C4C"
          strokeWidth="1.5"
          strokeMiterlimit="10"
        />
        <path
          d="M15.8574 15.8561L21.0001 20.9987"
          stroke="#4C4C4C"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
      </svg>
      <input
        className="search__input"
        type="text"
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export default Search;
