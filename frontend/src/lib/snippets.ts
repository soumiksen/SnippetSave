import { apiRequest } from './api';

export interface Snippet {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const getUserSnippets = async (): Promise<Snippet[]> => {
  const data = await apiRequest<{ snippets: Snippet[] }>('/api/snippets');
  return data.snippets;
};

export const createSnippet = async (
  title: string,
  content: string
): Promise<Snippet> => {
  const data = await apiRequest<{ snippet: Snippet }>('/api/snippets', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
  return data.snippet;
};

export const updateSnippet = async (
  snippetId: string,
  updates: { title?: string; content?: string }
): Promise<Snippet> => {
  const data = await apiRequest<{ snippet: Snippet }>(
    `/api/snippets/${snippetId}`,
    {
      method: 'PUT',
      body: JSON.stringify(updates),
    }
  );
  return data.snippet;
};

export const deleteSnippet = async (snippetId: string): Promise<void> => {
  await apiRequest<void>(`/api/snippets/${snippetId}`, { method: 'DELETE' });
};
