import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI with rose-gold theme styling
      return (
        <div className="min-h-screen bg-blush flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-diamond text-rose-dark mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-dark">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>

            <div className="space-y-3">
              <button
                className="w-full bg-rose hover:bg-rose-dark text-white font-medium py-2 px-4 rounded transition-colors"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>

              <button
                className="w-full bg-gold hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition-colors"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              >
                Try Again
              </button>
            </div>

            {/* Show error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-rose-dark">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
