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
    <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-8 shadow-xl hover:shadow-2xl transition-shadow">
      <h2 className="text-3xl font-bold text-slate-100 mb-2">Ask a Business Question</h2>
      <p className="text-slate-400 mb-6 text-lg">
        Describe what you want to see, and AI will generate the perfect visualization instantly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Show me revenue by region for Q3 and highlight the top performer..."
            rows={3}
            className="flex-1 rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="flex h-fit items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white hover:from-blue-700 hover:to-cyan-700 active:from-blue-800 active:to-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-blue-500/50"
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
          <label className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-900/30 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900/50 hover:border-slate-500 cursor-pointer transition backdrop-blur-sm">
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

      <div className="mt-6 pt-6 border-t border-slate-700">
        <p className="text-sm font-semibold text-slate-300 mb-3">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((query) => (
            <button
              key={query}
              onClick={() => handleExampleClick(query)}
              disabled={isLoading}
              className="rounded-full border border-slate-600 bg-slate-900/30 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900/60 hover:border-slate-500 hover:text-slate-200 disabled:opacity-50 transition backdrop-blur-sm"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
