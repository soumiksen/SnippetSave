'use client';

import { Snippet } from '@/lib/snippets';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface SnippetModalProps {
  snippet: Snippet;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  handleUpdate: () => void;
  closeModal: () => void;
  handleDelete: () => void;
}

const SnippetModal = ({
  snippet,
  setTitle,
  setContent,
  handleUpdate,
  closeModal,
  handleDelete,
}: SnippetModalProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.focus();
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(textarea.scrollHeight, 128) + 'px';
    }
  }, []);

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(textarea.scrollHeight, 128) + 'px';
    }
  };

  return (
    <motion.div
      className='fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4'
      onClick={closeModal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        layoutId={`card-${snippet.id}`}
        onClick={(e) => e.stopPropagation()}
        className='bg-zinc-800 rounded-md p-6 shadow-2xl shadow-black w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col'
      >
        <input
          value={snippet.title}
          onChange={(e) => setTitle(e.target.value)}
          className='text-white font-bold text-2xl p-2 rounded mb-4 focus:outline-none'
        />

        <textarea
          ref={textareaRef}
          value={snippet.content}
          onChange={handleTextareaInput}
          placeholder='Edit your snippet here...'
          spellCheck={false}
          className='flex-1 bg-transparent text-white focus:outline-none p-2 rounded resize-none text-sm leading-5 w-full min-h-[128px] overflow-auto'
        />

        <div className='flex justify-end mt-4'>
          <button
            className='border border-red-500 text-red-500 px-4 py-1 mr-2 rounded-full hover:cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-200'
            onClick={() => {
              handleDelete();
              closeModal();
            }}
          >
            Delete
          </button>

          <button
            onClick={() => {
              handleUpdate();
              closeModal();
            }}
            className='bg-indigo-500 px-4 py-1 rounded-full hover:bg-indigo-600 text-white hover:cursor-pointer'
          >
            Update
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SnippetModal;
