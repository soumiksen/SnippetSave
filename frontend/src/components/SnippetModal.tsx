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
      className='fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4'
      onClick={closeModal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        layoutId={`card-${snippet.id}`}
        onClick={(e) => e.stopPropagation()}
        className='bg-primary border border-border rounded-2xl p-6 shadow-2xl shadow-black/30 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col'
      >
        <div className='flex items-start justify-between gap-3 mb-4'>
          <input
            value={snippet.title}
            onChange={(e) => setTitle(e.target.value)}
            className='text-text-primary font-bold text-2xl p-2 rounded-lg focus:outline-none focus:bg-secondary flex-1 min-w-0 transition-colors'
          />
          <button
            onClick={closeModal}
            aria-label='Close'
            className='p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-secondary transition-colors hover:cursor-pointer shrink-0'
          >
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={snippet.content}
          onChange={handleTextareaInput}
          placeholder='Edit your snippet here...'
          spellCheck={false}
          className='flex-1 bg-secondary/50 text-text-primary focus:outline-none p-3 rounded-lg resize-none font-mono text-sm leading-5 w-full min-h-[128px] overflow-auto'
        />

        <div className='flex justify-end mt-4 pt-4 border-t border-border'>
          <button
            className='border border-red-500/60 text-red-500 px-4 py-1.5 mr-2 rounded-full hover:cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200'
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
            className='bg-accent px-4 py-1.5 rounded-full hover:bg-accent-hover text-white font-medium shadow-sm hover:cursor-pointer transition-colors'
          >
            Update
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SnippetModal;
