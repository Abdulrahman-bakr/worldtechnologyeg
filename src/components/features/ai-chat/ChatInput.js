

import React from 'react';
import { PaperAirplaneIcon } from '../../icons/index.js';

const ChatInput = ({ input, setInput, handleSendMessage, isLoading, chat }) => (
  React.createElement("form", { onSubmit: handleSendMessage, className: "chat-input-area flex-shrink-0" },
    React.createElement("div", { className: "relative" },
      React.createElement("input", {
        type: "text",
        value: input,
        onChange: (e) => setInput(e.target.value),
        placeholder: "اسأل عن منتج أو عرض...",
        className: "w-full py-2.5 pl-12 pr-4 rounded-full border border-light-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-dark-50 focus:ring-primary focus:border-primary",
        disabled: isLoading || !chat
      }),
      React.createElement("button", {
        type: "submit",
        className: "absolute top-1/2 -translate-y-1/2 left-2 p-2 rounded-full bg-primary hover:bg-primary-hover text-white transition-colors disabled:bg-dark-500",
        disabled: isLoading || !input.trim() || !chat,
        "aria-label": "إرسال"
      }, React.createElement(PaperAirplaneIcon, { className: "w-5 h-5" }))
    )
  )
);

export { ChatInput };