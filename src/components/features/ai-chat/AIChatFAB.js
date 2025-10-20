

import React from 'react';
import { ChatBotIcon } from '../../icons/index.js';

const AIChatFAB = ({ onOpen }) => {
  return React.createElement("button", {
    onClick: onOpen,
    className: "ai-chat-fab",
    "aria-label": "فتح المساعد الذكي"
  },
    React.createElement(ChatBotIcon, { className: "w-8 h-8 text-white" })
  );
};

export { AIChatFAB };