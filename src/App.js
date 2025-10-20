

import React, { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout.js';
import { useApp } from './contexts/AppContext.js';

const App = () => {
  const { fetchInitialData } = useApp();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);
  
  return (
      React.createElement(AppLayout, null)
  );
};

export { App };