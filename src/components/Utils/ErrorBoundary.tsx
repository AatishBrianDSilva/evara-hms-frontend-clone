import React from 'react';
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Initialize state to track if an error has occurred
    this.state = { hasError: false };
  }

  // Update state when an error is thrown
  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  // Optional: Log error information
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('An error occurred:', error, errorInfo);
    // You can also log the error to an external service here
  }

  render() {
    if (this.state.hasError) {
      // Render your fallback component when an error is caught
      return <ErrorBoundaryFallback />;
    }

    // Otherwise, render the child components
    return this.props.children;
  }
}

export default ErrorBoundary;
