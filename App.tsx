import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { startChat } from './services/geminiService';
import type { Message } from './types';
import { Role } from './types';
import ChatMessage from './components/ChatMessage';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const newChat = startChat();
      setChat(newChat);
    } catch (e) {
      console.error(e);
      setError("Failed to initialize the chat service. Please check your API key.");
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (isLoading || !messageText.trim() || !chat) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = { role: Role.USER, text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');

    try {
      const response = await chat.sendMessage({ message: messageText });
      const modelMessage: Message = { role: Role.MODEL, text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get a response. ${errorMessage}`);
      // Remove the user's message if the API call fails to allow them to try again
      setMessages(prev => prev.slice(0, -1)); 
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(userInput);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg">
        <h1 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Đức Mạnh AI ChatBot
        </h1>
      </header>

      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <WelcomeScreen onExampleClick={handleSendMessage} />
        ) : (
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))
        )}
        {isLoading && <ChatMessage message={{ role: Role.MODEL, text: "..." }} isLoading={true} />}
        {error && <div className="text-red-500 bg-red-900/50 p-3 rounded-lg text-center">{error}</div>}
      </main>

      <footer className="p-4 md:p-6 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="p-3 bg-blue-600 rounded-full hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-transform transform active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default App;
