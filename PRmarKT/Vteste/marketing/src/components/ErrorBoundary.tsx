import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-8">
          <div className="bg-zinc-900 border border-red-500/50 p-6 rounded-xl max-w-xl text-left">
            <h1 className="text-xl font-bold text-red-500 mb-4">UI Rendering Error</h1>
            <p className="text-zinc-400 mb-4">Something went wrong while rendering the UI.</p>
            <pre className="bg-black p-4 rounded text-xs text-red-400 overflow-x-auto">
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="mt-6 px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
