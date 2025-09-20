'use client';

import { auth } from '@/lib/config';
import {
  createSnippet,
  deleteSnippet,
  getUserSnippets,
  Snippet,
  updateSnippet,
} from '@/lib/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

import Card from '@/components/Card';
import SnippetInput from '@/components/SnippetInput';
import SnippetModal from '@/components/SnippetModal';

const Snippets = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [title, setTitle] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else {
        setUserId(null);
        setSnippets([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      getUserSnippets(userId).then(setSnippets).catch(console.error);
    }
  }, [userId]);

  const handleCreateSnippet = async () => {
    if (!userId) return;
    await createSnippet(userId, title, code, language);
    const updated = await getUserSnippets(userId);
    setSnippets(updated);
    setCode('');
    setTitle('');
    setLanguage('javascript');
  };

  const handleUpdateSnippet = async () => {
    if (!userId || !selectedSnippet || !selectedSnippet.id) return;

    await updateSnippet(userId, selectedSnippet.id, {
      title: selectedSnippet.title,
      code: selectedSnippet.code,
      language: selectedSnippet.language,
    });

    setSelectedSnippet(null);

    if (userId) {
      const updated = await getUserSnippets(userId);
      setSnippets(updated);
    }
  };

  const handleDeleteSnippet = async () => {
  if (!userId || !selectedSnippet || !selectedSnippet.id) return;

  try {
    await deleteSnippet(userId, selectedSnippet.id);
    setSelectedSnippet(null);

    const updated = await getUserSnippets(userId);
    setSnippets(updated);
  } catch (err) {
    console.error('🔥 Error deleting snippet:', err);
  }
};


  return (
    <div className='grid py-5'>
      <SnippetInput
        code={code}
        setCode={setCode}
        title={title}
        setTitle={setTitle}
        language={language}
        setLanguage={setLanguage}
        handleSave={handleCreateSnippet}
      />

      <div className='columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4'>
        {snippets.map((snippet) => (
          <Card
            key={snippet.id}
            id={snippet.id!}
            title={snippet.title}
            content={snippet.code}
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
          setCode={(code) =>
            setSelectedSnippet((prev) => (prev ? { ...prev, code } : null))
          }
          setLanguage={(lang) =>
            setSelectedSnippet((prev) =>
              prev ? { ...prev, language: lang } : null
            )
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
