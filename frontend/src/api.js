const API_BASE = '/api';

export const queryData = async (prompt, sessionToken = null, history = []) => {
  const response = await fetch(`${API_BASE}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      session_token: sessionToken,
      history,
    }),
  });
  return response.json();
};

export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const getSchema = async (sessionToken = null) => {
  const params = new URLSearchParams();
  if (sessionToken) params.append('session_token', sessionToken);

  const response = await fetch(`${API_BASE}/schema?${params}`);
  return response.json();
};

export const health = async () => {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
};
