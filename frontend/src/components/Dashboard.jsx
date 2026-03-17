import React, { useState, useCallback } from 'react';
import { ChartRenderer } from './ChartRenderer';
import { MetricsGrid } from './MetricsGrid';
import { DataTable } from './DataTable';
import { QueryInput } from './QueryInput';
import { ErrorAlert } from './ErrorAlert';
import { SuccessAlert } from './SuccessAlert';
import { ChatPanel } from './ChatPanel';
import { Header } from './Header';
import { LoadingSkeleton } from './LoadingSkeleton';
import { queryData, uploadCSV } from '../api';

export const Dashboard = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const handleQuerySubmit = useCallback(async (text) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await queryData(text, sessionToken, chatMessages);

      if (result.error) {
        setError(result.error);
        if (result.suggestion) {
          setError(result.error + '. ' + result.suggestion);
        }
      } else {
        setDashboardData(result);
        setPrompt('');
        if (chatMessages.length === 0) {
          setChatMessages([]);
        }
      }
    } catch (err) {
      setError('Failed to generate dashboard. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionToken, chatMessages]);

  const handleUpload = useCallback(async (file) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await uploadCSV(file);

      if (result.error) {
        setError(result.error);
      } else {
        setUploadedFile(result.filename);
        setSessionToken(result.session_token);
        setSuccess(`Successfully uploaded ${result.filename}`);
        setDashboardData(null);
        setChatMessages([]);
      }
    } catch (err) {
      setError('Failed to upload CSV. Please ensure it\'s a valid CSV file.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendFollowUp = useCallback(async (message) => {
    if (!dashboardData) return;

    setChatMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);
    setError(null);

    try {
      const updatedHistory = [
        ...chatMessages,
        { role: 'user', content: message },
      ];

      const result = await queryData(message, sessionToken, updatedHistory);

      if (result.error) {
        setError(result.error);
        setChatMessages((prev) =>
          prev.slice(0, -1) // Remove user message if query failed
        );
      } else {
        setDashboardData(result);
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', content: result.insight || 'Dashboard updated.' },
        ]);
      }
    } catch (err) {
      setError('Failed to process follow-up question.');
      setChatMessages((prev) => prev.slice(0, -1));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [dashboardData, sessionToken, chatMessages]);

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header uploadedFile={uploadedFile} />

      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-10">
        <QueryInput
          prompt={prompt}
          setPrompt={setPrompt}
          onSubmit={handleQuerySubmit}
          onUpload={handleUpload}
          isLoading={isLoading}
        />

        {error && (
          <ErrorAlert
            error={error}
            onDismiss={() => setError(null)}
          />
        )}

        {success && (
          <SuccessAlert
            message={success}
            onDismiss={() => setSuccess(null)}
          />
        )}

        {isLoading && !dashboardData && <LoadingSkeleton gridCols={2} />}

        {dashboardData && (
          <div className="fade-in space-y-8">
            <MetricsGrid
              rowCount={dashboardData.row_count}
              dataSource={uploadedFile || 'Default Database'}
              insight={dashboardData.insight}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {dashboardData.charts &&
                dashboardData.charts.map((chart, idx) => (
                  <ChartRenderer
                    key={idx}
                    chart={chart}
                    data={dashboardData.data}
                  />
                ))}
            </div>

            <ChatPanel
              messages={chatMessages}
              onSendMessage={handleSendFollowUp}
              isLoading={isLoading}
              sessionToken={sessionToken}
              dataSource={uploadedFile || 'Default Database'}
            />

            <DataTable
              data={dashboardData.data}
              sql={dashboardData.sql}
            />
          </div>
        )}
      </main>
    </div>
  );
};
