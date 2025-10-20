

import React from 'react';
import { CloseIcon, ChatBotIcon } from '../../icons/index.js';

const ChatHeader = ({ onClose }) => (
  React.createElement("div", { className: "flex items-center justify-between p-4 border-b border-light-300 dark:border-dark-600 flex-shrink-0" },
    React.createElement("div", { className: "flex items-center gap-2" },
        React.createElement(ChatBotIcon, { className: "w-6 h-6 text-primary" }),
        React.createElement("h2", { id: "ai-chat-title", className: "text-lg font-bold text-primary" }, "المساعد الذكي")
    ),
    React.createElement("button", { onClick: onClose, className: "p-1.5 rounded-full text-dark-600 dark:text-dark-300 hover:bg-light-100 dark:hover:bg-dark-700", "aria-label": "إغلاق الدردشة" },
      React.createElement(CloseIcon, { className: "w-5 h-5" })
    )
  )
);

export { ChatHeader };