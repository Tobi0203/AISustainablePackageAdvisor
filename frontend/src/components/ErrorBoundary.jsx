import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error("UI error:", error);
  }
  render() {
    if (this.state.hasError)
      return (
        <main className="grid min-h-screen place-items-center bg-[#f7faf7] p-6 text-center">
          <div className="card max-w-md p-8">
            <p className="text-4xl">!</p>
            <h1 className="mt-4 text-2xl text-forest">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-500">
              Refresh the page to continue. If this persists, please contact
              support.
            </p>
            <button
              className="btn-primary mt-6"
              onClick={() => window.location.reload()}
            >
              Refresh page
            </button>
          </div>
        </main>
      );
    return this.props.children;
  }
}
