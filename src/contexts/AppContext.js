import React, { createContext, useContext } from 'react';
import { useAppLogic } from '../hooks/useAppLogic.js';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const appLogic = useAppLogic();
    return (
        React.createElement(AppContext.Provider, { value: appLogic }, children)
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
