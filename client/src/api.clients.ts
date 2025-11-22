const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

if(!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not set');
}


export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  if(!response.ok) {
    throw new Error('Failed to check health');
  }
  return response.json();
}

export const generateCode = async (prompt: string, language: string) => {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, language }),
  });
  if(!response.ok) {
    throw new Error('Failed to generate code');
  }
  return response.json();
}

export interface HistoryItem {
  id: string
  prompt: string
  code: string
  language: string
  timestamp: string
}

export interface HistoryResponse {
  success: boolean
  data: HistoryItem[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export const getHistory = async (page: number = 1, limit: number = 10, language?: string): Promise<HistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (language) {
    params.append('language', language);
  }

  const response = await fetch(`${API_BASE_URL}/api/history?${params.toString()}`);
  if(!response.ok) {
    throw new Error('Failed to fetch history');
  }
  return response.json();
}