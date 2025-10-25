

import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout.js';
import { useApp } from './contexts/AppContext.js';

// Lazy load page components for code splitting
const HomeView = lazy(() => import('./pages/HomeView.js').then(module => ({ default: module.HomeView })));
const ProductListView = lazy(() => import('./pages/ProductListView.js').then(module => ({ default: module.ProductListView })));
const ProductDetailView = lazy(() => import('./pages/ProductDetailView.js').then(module => ({ default: module.ProductDetailView })));
const TermsView = lazy(() => import('./pages/Static-Pages/TermsOfServiceView.js').then(module => ({ default: module.TermsView })));
const FAQView = lazy(() => import('./pages/Static-Pages/FAQView.js').then(module => ({ default: module.FAQView })));
const AboutUsView = lazy(() => import('./pages/Static-Pages/AboutUsView.js').then(module => ({ default: module.AboutUsView })));
const WishlistView = lazy(() => import('./pages/WishlistView.js').then(module => ({ default: module.WishlistView })));
const UserProfileView = lazy(() => import('./pages/UserProfileView.js').then(module => ({ default: module.UserProfileView })));
const OrdersView = lazy(() => import('./pages/OrdersView.js').then(module => ({ default: module.OrdersView })));
const OrderTrackingView = lazy(() => import('./pages/OrderTrackingView.js').then(module => ({ default: module.OrderTrackingView })));
const AdminDashboardView = lazy(() => import('./pages/AdminDashboardView.js').then(module => ({ default: module.AdminDashboardView })));
const AudioTranscriptionView = lazy(() => import('./pages/AudioTranscriptionView.js').then(module => ({ default: module.AudioTranscriptionView })));


const LoadingFallback = () => (
    React.createElement("div", { className: "w-full min-h-[calc(100vh-200px)] flex items-center justify-center" },
        React.createElement("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" })
    )
);

const App = () => {
  const { fetchInitialData } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const handleOrderNavigation = () => {
        setTimeout(() => {
            navigate('/orders');
        }, 1000); // Delay to allow user to see the success toast
    };

    window.addEventListener('orderCompleted', handleOrderNavigation);

    return () => {
        window.removeEventListener('orderCompleted', handleOrderNavigation);
    };
  }, [navigate]);
  
  return (
      React.createElement(Suspense, { fallback: React.createElement(LoadingFallback, null) },
        React.createElement(Routes, null,
          React.createElement(Route, { path: "/", element: React.createElement(AppLayout, null) },
            React.createElement(Route, { index: true, element: React.createElement(HomeView, null) }),
            React.createElement(Route, { path: "products", element: React.createElement(ProductListView, null) }),
            React.createElement(Route, { path: "category/:categoryId", element: React.createElement(ProductListView, null) }),
            React.createElement(Route, { path: "offers", element: React.createElement(ProductListView, { showAllOffersView: true }) }),
            React.createElement(Route, { path: "search", element: React.createElement(ProductListView, { isSearchPage: true }) }),
            React.createElement(Route, { path: "product/:productId", element: React.createElement(ProductDetailView, null) }),
            React.createElement(Route, { path: "wishlist", element: React.createElement(WishlistView, null) }),
            React.createElement(Route, { path: "profile", element: React.createElement(UserProfileView, null) }),
            React.createElement(Route, { path: "orders", element: React.createElement(OrdersView, null) }),
            React.createElement(Route, { path: "track-order", element: React.createElement(OrderTrackingView, null) }),
            React.createElement(Route, { path: "terms", element: React.createElement(TermsView, null) }),
            React.createElement(Route, { path: "faq", element: React.createElement(FAQView, null) }),
            React.createElement(Route, { path: "about-us", element: React.createElement(AboutUsView, null) }),
            React.createElement(Route, { path: "transcribe", element: React.createElement(AudioTranscriptionView, null) }),
            React.createElement(Route, { path: "*", element: React.createElement(HomeView, null) }) // Fallback to home for any unknown routes
          ),
          React.createElement(Route, { path: "/admin/*", element: React.createElement(AdminDashboardView, null) })
        )
      )
  );
};

export { App };