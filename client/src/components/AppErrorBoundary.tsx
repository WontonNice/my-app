import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, ShieldAlert } from "lucide-react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  crashed: boolean;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { crashed: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { crashed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("The dashboard UI stopped unexpectedly.", error, info.componentStack);
  }

  render() {
    if (!this.state.crashed) return this.props.children;

    return (
      <main className="app-crash-shell" role="alert">
        <section className="app-crash-card">
          <span className="app-crash-icon" aria-hidden="true"><ShieldAlert size={28} /></span>
          <p className="eyebrow">Dashboard recovery</p>
          <h1>This page needs a quick refresh.</h1>
          <p>Your saved records are kept on the server. Reload to reconnect and continue.</p>
          <button className="primary-button" type="button" onClick={() => window.location.reload()}>
            <RefreshCw size={17} /> Reload dashboard
          </button>
        </section>
      </main>
    );
  }
}
