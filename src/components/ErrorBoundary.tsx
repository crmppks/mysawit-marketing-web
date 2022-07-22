import React from 'react';
import { Alert } from 'antd';

class ErrorBoundary extends React.Component<
  { children: React.Component },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Alert
          message={'Something went wrong catched by Error Boundaries'}
          type="error"
          className="m-5"
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
