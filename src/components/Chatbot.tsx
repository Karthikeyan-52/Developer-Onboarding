import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', content: 'Hello! I am a simulated assistant. How can I help you today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response with a delay
    setTimeout(() => {
      const responseContent = getDynamicResponse(userMessage.content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: responseContent,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const getDynamicResponse = (input: string) => {
    const text = input.toLowerCase();
    if (text.includes('hello') || text.includes('hi')) {
      return 'Hello there! How are you doing?';
    }
    if (text.includes('help')) {
      return 'I can help you navigate this application. What do you need assistance with?';
    }
    if (text.includes('pricing')) {
      return 'Our pricing is flexible and depends on your usage. Please contact sales for more info.';
    }
    if (text.includes('thanks') || text.includes('thank you')) {
      return 'You are very welcome!';
    }
    if (text.includes('error') || text.includes('bug')) {
      return 'I am sorry you are experiencing issues. Could you provide a bit more detail?';
    }
    // Default echo behavior with dynamic twist
    return `I heard you say: "${input}". Since I am a simulated bot, I can only repeat or respond to specific simple keywords right now.`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all z-50 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-blue-700 p-1 rounded transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 h-80 overflow-y-auto flex flex-col gap-3 bg-gray-50 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[85%] p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white self-end rounded-tr-none'
                : 'bg-white border border-gray-200 text-gray-800 self-start rounded-tl-none shadow-sm'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="bg-white border border-gray-200 text-gray-800 self-start max-w-[85%] p-4 rounded-lg rounded-tl-none shadow-sm flex items-center gap-1.5 h-10">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
            <span
              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></span>
            <span
              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.4s' }}
            ></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
