import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-container">
                    <div className="fox-error">
                        <div className="fox-face sad">
                            <div className="fox-ears">
                                <div className="ear left"></div>
                                <div className="ear right"></div>
                            </div>
                            <div className="fox-eyes">
                                <div className="eye left"></div>
                                <div className="eye right"></div>
                            </div>
                            <div className="fox-nose"></div>
                        </div>
                        <p>Oops! Something went wrong</p>
                        <button onClick={() => window.location.reload()}>
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
