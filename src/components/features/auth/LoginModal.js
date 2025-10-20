import React, { useState, useEffect, useMemo } from 'react';
import { CloseIcon } from '../../icons/index.js';
import { useAuthHandlers } from '../../../hooks/useAuthHandlers.js';
import { LoginForm } from './LoginForm.js';
import { SignupForm } from './SignupForm.js';
import { ForgotPasswordForm } from './ForgotPasswordForm.js';
import { SocialLogin } from './SocialLogin.js';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [contentAnimation, setContentAnimation] = useState('');
  const [mode, setMode] = useState('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const {
    handleEmailSignup,
    handleEmailLogin,
    handleGoogleSignIn,
    handleForgotPassword
  } = useAuthHandlers({ onLoginSuccess, setError, setSuccessMessage, setIsLoading });
  
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        setContentAnimation('animate-fade-in-up');
      });
      setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); setPhone('');
      setError(''); setSuccessMessage(''); setMode('login');
      setIsPasswordVisible(false); setIsConfirmPasswordVisible(false);
    } else if (isRendered) {
      document.body.style.overflow = '';
      setContentAnimation('animate-fade-out-up');
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, isRendered]);

  const isFormValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.toLowerCase().trim();
    if (mode === 'login') return emailRegex.test(normalizedEmail) && password.trim() !== '';
    if (mode === 'signup') return name.trim() !== '' && emailRegex.test(normalizedEmail) && password.length >= 6 && password === confirmPassword && /^\d{11}$/.test(phone);
    if (mode === 'forgot') return emailRegex.test(normalizedEmail) && /^\d{11}$/.test(phone);
    return false;
  }, [mode, name, email, password, confirmPassword, phone]);

  const handleAuthAction = (e) => {
    e.preventDefault();
    if (mode === 'signup') {
        handleEmailSignup(name, email, phone, password, confirmPassword);
    } else { // 'login' mode
        handleEmailLogin(email, password);
    }
  };

  const handleForgotAction = (e) => {
    e.preventDefault();
    handleForgotPassword(email, phone);
  };
  
  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMessage('');
    if (newMode === 'signup') { setEmail(''); setPhone(''); }
    setPassword(''); setConfirmPassword(''); setName('');
  };

  if (!isRendered) return null;
  
  const renderFormContent = () => {
    switch (mode) {
      case 'signup':
        return React.createElement(SignupForm, {
          name, setName, email, setEmail, phone, setPhone, password, setPassword,
          confirmPassword, setConfirmPassword, isPasswordVisible, setIsPasswordVisible,
          isConfirmPasswordVisible, setIsConfirmPasswordVisible,
          handleAuthAction, isLoading, isFormValid
        });
      case 'forgot':
        return React.createElement(ForgotPasswordForm, {
          email, setEmail, phone, setPhone, handleForgotPassword: handleForgotAction,
          isLoading, isFormValid, error, successMessage, switchMode
        });
      case 'login':
      default:
        return React.createElement(LoginForm, { 
          email, setEmail, password, setPassword, isPasswordVisible, setIsPasswordVisible,
          handleAuthAction, isLoading, isFormValid, switchMode
        });
    }
  };

  return React.createElement("div", {
    className: `fixed inset-0 z-[110] flex items-center justify-center p-4 ${isRendered ? '' : 'hidden'}`,
    role: "dialog", "aria-modal": "true"
  },
  React.createElement("div", { className: `modal-overlay absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`, onClick: onClose }),
  React.createElement("div", { className: `modal-content bg-white dark:bg-dark-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative ${contentAnimation} border border-light-200 dark:border-dark-700` },
    React.createElement("button", { onClick: onClose, className: "absolute top-4 left-4 text-dark-600 dark:text-dark-300 p-1", "aria-label": "إغلاق" }, React.createElement(CloseIcon, { className: "w-5 h-5" })),
    
    mode !== 'forgot' && React.createElement(React.Fragment, null,
        React.createElement("div", {className: "flex justify-center mb-6"},
          React.createElement("div", {className: "bg-light-100 dark:bg-dark-700 p-1 rounded-lg flex space-x-1"},
            React.createElement("button", {onClick: () => switchMode('login'), className: `px-6 py-2 rounded-md text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-primary text-white' : 'text-dark-700 dark:text-dark-100'}`}, "تسجيل الدخول"),
            React.createElement("button", {onClick: () => switchMode('signup'), className: `px-6 py-2 rounded-md text-sm font-semibold transition-colors ${mode === 'signup' ? 'bg-primary text-white' : 'text-dark-700 dark:text-dark-100'}`}, "إنشاء حساب")
          )
        ),
        error && mode !== 'forgot' && React.createElement("p", { className: "text-sm text-red-500 text-center mb-4" }, error),
        renderFormContent(),
        React.createElement("div", { className: "relative flex py-5 items-center" },
          React.createElement("div", { className: "flex-grow border-t border-light-300 dark:border-dark-600" }),
          React.createElement("span", { className: "flex-shrink mx-4 text-sm text-dark-600 dark:text-dark-300" }, "أو"),
          React.createElement("div", { className: "flex-grow border-t border-light-300 dark:border-dark-600" })
        ),
        React.createElement(SocialLogin, { onGoogleSignIn: handleGoogleSignIn, isLoading: isLoading })
    ),
    
    mode === 'forgot' && renderFormContent()
  ));
};