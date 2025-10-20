

import React from 'react';
import { RobotIcon, UserIcon } from '../../icons/index.js';
import { markdownToHtml } from '../../../utils/helpers/formatters.js';

const ChatMessages = ({ history, isLoading, error, messagesEndRef }) => (
  React.createElement("div", { className: "chat-messages-container" },
    history.map((msg, index) => (
      React.createElement("div", { key: index, className: `chat-message ${msg.role}` },
        React.createElement("div", { className: "chat-message-avatar" },
          msg.role === 'model' 
            ? React.createElement(RobotIcon, { className: "w-6 h-6 text-white dark:text-dark-100" }) 
            : React.createElement(UserIcon, { className: "w-6 h-6 text-white" })
        ),
         msg.role === 'model'
          ? React.createElement("div", { 
              className: "chat-message-bubble",
              dangerouslySetInnerHTML: { __html: markdownToHtml(msg.text) }
            })
          : React.createElement("div", { className: "chat-message-bubble" }, msg.text)
      )
    )),
    isLoading && !history.some(h => h.role === 'model' && h.text) && React.createElement("div", { className: "chat-message model" },
        React.createElement("div", { className: "chat-message-avatar" }, React.createElement(RobotIcon, { className: "w-6 h-6 text-white dark:text-dark-100" })),
        React.createElement("div", { className: "chat-message-bubble" },
          React.createElement("div", { className: "ai-loading-indicator" },
            React.createElement("span"), React.createElement("span"), React.createElement("span")
          )
        )
    ),
    error && React.createElement("div", { className: "text-center text-red-500 text-sm p-2" }, error),
    React.createElement("div", { ref: messagesEndRef })
  )
);

export { ChatMessages };