import "./Loading.scss";

interface LoadingProps {
  message?: string;
}

const Loading = ({ message }: LoadingProps) => {
  return (
    <div className="loading">
      <div className="loading__spinner" />
      {message && <p className="loading__message">{message}</p>}
    </div>
  );
};

export default Loading;
