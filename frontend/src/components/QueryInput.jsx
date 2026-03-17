import React, { useRef } from 'react';
import { Upload, Send, Loader } from 'lucide-react';

export const QueryInput = ({ prompt, setPrompt, onSubmit, onUpload, isLoading }) => {
  const fileInputRef = useRef(null);

  const exampleQueries = [
    'Compare average online spend by shopping preference',
    'Show the distribution of customers by city tier',
    'Compare average store visits by gender',
    'Show the relationship between tech savvy score and average online spend',
  ];

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
    }
  };

  const handleExampleClick = (query) => {
    setPrompt(query);
  };

  return (
    <section className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Ask a Business Question</h2>
      <p className="text-gray-600 mb-6">
        Describe what you want to see in your dashboard, and AI will generate the perfect visualization for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Show me revenue by region for Q3 and highlight the top performer..."
            rows={3}
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="flex h-fit items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <label className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer transition">
            <Upload className="h-4 w-4" />
            Upload CSV
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={isLoading}
          />
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-3">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((query) => (
            <button
              key={query}
              onClick={() => handleExampleClick(query)}
              disabled={isLoading}
              className="rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 transition"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
