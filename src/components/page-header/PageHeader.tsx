import "./page-header.scss";
import BackButton from "../../ui-kit/button/icon-buttons/back-button/BackButton";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

const PageHeader = ({ title, onBack }: PageHeaderProps) => (
  <div className="page-header">
    <BackButton onClick={onBack} />
    <h1 className="page-header__title">{title}</h1>
  </div>
);

export default PageHeader;
