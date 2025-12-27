import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

const DefaultErrorFallback = ({ error, reset }: { error?: Error; reset: () => void }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full text-center">
      <div className="text-6xl mb-4">😵</div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        The game encountered an unexpected error. Don't worry, your progress is saved!
      </p>
      {error && process.env.NODE_ENV === 'development' && (
        <details className="text-left bg-gray-100 dark:bg-gray-700 rounded p-3 mb-4 text-sm">
          <summary className="cursor-pointer font-medium">Error Details</summary>
          <pre className="mt-2 whitespace-pre-wrap text-xs text-red-600 dark:text-red-400">
            {error.message}
            {error.stack}
          </pre>
        </details>
      )}
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
      <button
        onClick={() => window.location.reload()}
        className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Reload Game
      </button>
    </div>
  </div>
);

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Log to external error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // Sentry.captureException(error, { extra: errorInfo });
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}