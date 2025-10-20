import React, { Component } from 'react';

// --- START OF ErrorBoundary component ---
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Determine theme for error page based on html class
      const isLightTheme = document.documentElement.classList.contains('theme-light');
      const bgColor = isLightTheme ? 'bg-light-50' : 'bg-dark-900';
      const textColor = isLightTheme ? 'text-light-900' : 'text-dark-50'; // Main text
      const subTextColor = isLightTheme ? 'text-light-700' : 'text-dark-100'; // Subdued text (updated for better dark contrast)
      const detailBgColor = isLightTheme ? 'bg-light-100' : 'bg-dark-800';
      const detailTextColor = isLightTheme ? 'text-light-600' : 'text-dark-200'; // Detail text (can be slightly dimmer)


      return React.createElement("div", {
        className: `flex flex-col items-center justify-center min-h-screen ${bgColor} ${textColor} p-4 sm:p-8`,
        role: "alert"
      },
        React.createElement("h1", { className: "text-2xl sm:text-3xl font-bold text-red-500 mb-4" }, "عذراً، حدث خطأ ما"),
        React.createElement("p", { className: `text-md sm:text-lg ${subTextColor} mb-6 text-center` },
          "نحن نأسف للإزعاج. يرجى محاولة تحديث الصفحة، أو العودة لاحقاً."
        ),
        React.createElement("button", {
          onClick: () => window.location.reload(),
          className: "bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        }, "تحديث الصفحة"),
        this.state.error && React.createElement("details", { className: `mt-8 p-4 ${detailBgColor} rounded-lg text-left w-full max-w-2xl` },
          React.createElement("summary", { className: "text-primary cursor-pointer font-medium" }, "تفاصيل الخطأ (للمطورين)"),
          React.createElement("pre", {
            className: `mt-2 text-xs ${detailTextColor} whitespace-pre-wrap overflow-auto`,
            style: { maxHeight: '200px', direction: 'ltr' }
          },
            (this.state.error && this.state.error.toString()) || '',
            (this.state.errorInfo && this.state.errorInfo.componentStack) ? `\n\nComponent Stack:\n${this.state.errorInfo.componentStack}` : ''
          )
        )
      );
    }
    return this.props.children;
  }
}
// --- END OF ErrorBoundary component ---
export { ErrorBoundary };