import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Client runtime error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
          <div className="max-w-2xl w-full bg-gray-900 border border-red-500/30 rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-red-400 mb-3">Application Error</h1>
            <p className="text-gray-300 mb-4">
              The client hit a runtime error while rendering.
            </p>
            <pre className="text-sm text-red-200 bg-black/30 rounded-xl p-4 overflow-auto whitespace-pre-wrap">
              {this.state.error?.message || 'Unknown error'}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
