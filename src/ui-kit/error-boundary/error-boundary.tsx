import { Component, ReactNode } from "react";
import i18n from "../../plugins/i18n";
import "./error-boundary.scss";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <p className="error-boundary__title">
              {i18n.t("common:errorBoundary.title")}
            </p>
            <p className="error-boundary__subtitle">
              {i18n.t("common:errorBoundary.subtitle")}
            </p>
            <button
              className="button button--primary button--compact"
              onClick={() => window.location.reload()}
            >
              {i18n.t("common:errorBoundary.reload")}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
