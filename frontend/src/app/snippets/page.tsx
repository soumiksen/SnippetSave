'use client';

import { useAuth } from '@/context/AuthContext';
import {
  createSnippet,
  deleteSnippet,
  getUserSnippets,
  Snippet,
  updateSnippet,
} from '@/lib/snippets';
import { useEffect, useState } from 'react';

import Card from '@/components/Card';
import SnippetInput from '@/components/SnippetInput';
import SnippetModal from '@/components/SnippetModal';

const Snippets = () => {
  const { user, loading } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);

  useEffect(() => {
    if (user) {
      getUserSnippets().then(setSnippets).catch(console.error);
    } else {
      setSnippets([]);
    }
  }, [user]);

  const handleCreateSnippet = async () => {
    if (!user || !title.trim() || !content.trim()) return;

    const snippet = await createSnippet(title, content);
    setSnippets((prev) => [snippet, ...prev]);
    setContent('');
    setTitle('');
  };

  const handleUpdateSnippet = async () => {
    if (!user || !selectedSnippet) return;

    const updated = await updateSnippet(selectedSnippet.id, {
      title: selectedSnippet.title,
      content: selectedSnippet.content,
    });
    setSnippets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setSelectedSnippet(null);
  };

  const handleDeleteSnippet = async () => {
    if (!user || !selectedSnippet) return;

    try {
      await deleteSnippet(selectedSnippet.id);
      setSnippets((prev) => prev.filter((s) => s.id !== selectedSnippet.id));
      setSelectedSnippet(null);
    } catch (err) {
      console.error('Error deleting snippet:', err);
    }
  };

  if (loading) return null;

  return (
    <div className='grid py-5'>
      <SnippetInput
        content={content}
        setContent={setContent}
        title={title}
        setTitle={setTitle}
        handleSave={handleCreateSnippet}
      />

      <div className='columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4'>
        {snippets.map((snippet) => (
          <Card
            key={snippet.id}
            id={snippet.id}
            title={snippet.title}
            content={snippet.content}
            onClick={() => setSelectedSnippet(snippet)}
          />
        ))}
      </div>

      {selectedSnippet && (
        <SnippetModal
          snippet={selectedSnippet}
          setTitle={(title) =>
            setSelectedSnippet((prev) => (prev ? { ...prev, title } : null))
          }
          setContent={(content) =>
            setSelectedSnippet((prev) => (prev ? { ...prev, content } : null))
          }
          handleUpdate={handleUpdateSnippet}
          handleDelete={handleDeleteSnippet}
          closeModal={() => setSelectedSnippet(null)}
        />
      )}
    </div>
  );
};

export default Snippets;
