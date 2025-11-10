/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
    import './styles/base/typography.css';
    import './styles/base/main.css';
    import './styles/layout/header.css';
    import './styles/layout/sticky-bars.css';
    import './styles/themes/light.css';
    import './styles/themes/dark.css';
    import './styles/animations/keyframes.css';
    import './styles/animations/classes.css';
    import './styles/components/accordion.css';
    import './styles/components/admin-dashboard.css';
    import './styles/components/ai-chat.css';
    import './styles/components/buttons.css';
    import './styles/components/comparison.css';
    import './styles/components/countdown.css';
    import './styles/components/forms.css';
    import './styles/components/game-topup.css';
    import './styles/components/modals.css';
    import './styles/components/popular-tag.css';
    import './styles/components/reviews.css';
    import './styles/components/skeleton.css';
    import './styles/components/social-share.css';
    import './styles/components/star-rating.css';
    import './styles/utils/scrollbars.css';
    import React, { StrictMode } from 'react';
    import { createRoot } from 'react-dom/client';
    import { BrowserRouter } from 'react-router-dom';
    import { HelmetProvider } from 'react-helmet-async';
    import { App } from './App.js';
    import { ErrorBoundary } from './components/ErrorBoundary.js';
    import { AppProvider } from './contexts/AppContext.js';

    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error("Could not find root element to mount to");
    }

    const root = createRoot(rootElement);
    root.render(
      React.createElement(StrictMode, null,
        React.createElement(ErrorBoundary, null,
          React.createElement(HelmetProvider, null,
            React.createElement(AppProvider, null,
              React.createElement(BrowserRouter, null,
                  React.createElement(App, null)
              )
            )
          )
        )
      )
    );