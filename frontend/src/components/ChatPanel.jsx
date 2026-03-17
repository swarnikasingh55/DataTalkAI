import React, { useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';

export const ChatPanel = ({
  messages,
  onSendMessage,
  isLoading,
  sessionToken,
  dataSource,
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!sessionToken && !messages.length) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.message;
    const message = input.value.trim();

    if (message && !isLoading) {
      onSendMessage(message);
      input.value = '';
    }
  };

  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Questions</h3>
      <p className="text-sm text-gray-600 mb-4">
        Chat with your dashboard to refine, filter, or adjust the current visualization.
      </p>

      <div className="space-y-4 mb-6 h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 border border-gray-200">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">
              Generate a dashboard first, then ask follow-up questions here.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-300 text-gray-900 rounded-lg p-3 flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          name="message"
          placeholder="Filter to only top regions... or any follow-up question"
          disabled={isLoading}
          className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
};
