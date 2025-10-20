import React, { useState, useEffect, useRef } from 'react';
import { useAIChatLogic } from './useAIChatLogic.js';
import { ChatHeader } from './ChatHeader.js';
import { ChatMessages } from './ChatMessages.js';
import { ChatInput } from './ChatInput.js';

const AIChatModal = ({ isOpen, onClose, products, categories, recentlyViewedIds }) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [contentAnimation, setContentAnimation] = useState('');
  
  const messagesEndRef = useRef(null);

  const {
      chat, setChat, history, setHistory, input, setInput, isLoading, error, handleSendMessage
  } = useAIChatLogic({ isOpen, products, categories, recentlyViewedIds });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [history]);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        setContentAnimation('');
      });
    } else if (isRendered) {
      document.body.style.overflow = '';
      setContentAnimation('animate-fade-out-up');
      const timer = setTimeout(() => {
        setIsRendered(false);
        setHistory([]);
        setChat(null);
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, isRendered, setChat, setHistory]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isRendered) return null;

  return React.createElement("div", {
    className: `fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 ${isRendered ? '' : 'hidden'}`,
    role: "dialog", "aria-modal": "true", "aria-labelledby": "ai-chat-title"
  },
    React.createElement("div", { className: `modal-overlay absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`, onClick: handleOverlayClick }),
    React.createElement("div", { className: `modal-content ai-chat-modal-content bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-lg relative ${contentAnimation} border border-light-200 dark:border-dark-700` },
      React.createElement(ChatHeader, { onClose: onClose }),
      React.createElement(ChatMessages, { history: history, isLoading: isLoading, error: error, messagesEndRef: messagesEndRef }),
      React.createElement(ChatInput, { input: input, setInput: setInput, handleSendMessage: handleSendMessage, isLoading: isLoading, chat: chat })
    )
  );
};

export { AIChatModal };