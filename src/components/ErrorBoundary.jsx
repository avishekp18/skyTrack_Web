// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center p-4 text-red-200 bg-red-800/60 rounded-lg backdrop-blur-md">
                    <p>Something went wrong: {this.state.error?.message || 'Unknown error'}</p>
                    <p>Please try again later.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;