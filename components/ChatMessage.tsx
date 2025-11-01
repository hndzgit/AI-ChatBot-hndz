
import React from 'react';
import type { Message } from '../types';
import { Role } from '../types';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isUserModel = message.role === Role.USER;

  const wrapperClasses = `flex items-end gap-2 ${isUserModel ? 'justify-end' : 'justify-start'}`;
  const messageClasses = `max-w-xl px-4 py-3 rounded-2xl ${
    isUserModel 
      ? 'bg-blue-600 rounded-br-none' 
      : 'bg-gray-700 rounded-bl-none'
  }`;

  const TypingIndicator = () => (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
    </div>
  );

  return (
    <div className={wrapperClasses}>
       {!isUserModel && (
         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-400 flex-shrink-0"></div>
       )}
      <div className={messageClasses}>
        {isLoading ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{message.text}</p>}
      </div>
       {isUserModel && (
         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
         </div>
       )}
    </div>
  );
};

export default ChatMessage;
