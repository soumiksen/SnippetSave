'use client';

import { Snippet } from '@/lib/firestore';
import { highlightCode } from '@/lib/highlightCode';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface SnippetModalProps {
  snippet: Snippet;
  setTitle: (title: string) => void;
  setCode: (code: string) => void;
  setLanguage: (lang: string) => void;
  handleUpdate: () => void;
  closeModal: () => void;
  handleDelete: () => void;
}

const SnippetModal = ({
  snippet,
  setTitle,
  setCode,
  setLanguage,
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
    setCode(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(textarea.scrollHeight, 128) + 'px';
    }
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setCode(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        handleTextareaInput(e as any);
      }, 0);
    }
  };

  const renderHighlightedCode = () =>
    highlightCode(snippet.code, snippet.language);

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

        <div className='relative flex-1 overflow-auto'>
          <div
            className='absolute top-0 left-0 p-2 font-mono text-sm text-white pointer-events-none whitespace-pre-wrap overflow-hidden w-full'
            style={{ minHeight: '128px', wordWrap: 'break-word' }}
          >
            {renderHighlightedCode()}
          </div>

          <textarea
            ref={textareaRef}
            value={snippet.code}
            onChange={handleTextareaInput}
            onKeyDown={handleTextareaKeyDown}
            placeholder={`Edit your ${snippet.language} code here...`}
            spellCheck={false}
            className='relative bg-transparent text-transparent caret-white focus:outline-none p-2 rounded resize-none font-mono text-sm leading-5 w-full min-h-[128px] overflow-hidden'
          />
        </div>

        <div className='flex justify-between mt-4'>
          <select
            value={snippet.language}
            onChange={(e) => setLanguage(e.target.value)}
            className='bg-zinc-800 text-indigo-500 border border-indigo-500 px-2 py-1 appearance-none rounded-full text-sm w-24 text-center focus:outline-none hover:cursor-pointer'
          >
            <option value='javascript'>JavaScript</option>
            <option value='typescript'>TypeScript</option>
            <option value='python'>Python</option>
            <option value='html'>HTML</option>
            <option value='plaintext'>Plain Text</option>
          </select>
          <div>
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
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SnippetModal;
