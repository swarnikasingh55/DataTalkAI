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
    <div className="mb-8 rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Follow-up Questions</h3>
      <p className="text-sm text-slate-400 mb-4">
        Chat with your dashboard to refine, filter, or adjust the current visualization.
      </p>

      <div className="space-y-4 mb-6 h-96 overflow-y-auto bg-slate-900/30 rounded-lg p-4 border border-slate-700">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 text-sm">
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
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-100 rounded-lg p-3 flex items-center gap-2">
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
          className="flex-1 rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition disabled:opacity-50 backdrop-blur-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-cyan-700 active:from-blue-800 active:to-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-blue-500/50"
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
