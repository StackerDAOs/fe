import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI
    console.log({ error });
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    const { hasError } = this.state as any;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            display: 'flex',
            height: '100vvh',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <h2>Oops, there is an error!</h2>
          <button
            style={{ color: 'white' }}
            type='button'
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
