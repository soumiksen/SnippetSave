'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface SnippetInputProps {
  content: string;
  setContent: (content: string) => void;
  title: string;
  setTitle: (title: string) => void;
  handleSave: () => void;
}

const SnippetInput = ({
  content,
  setContent,
  title,
  setTitle,
  handleSave,
}: SnippetInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <div className="flex justify-center">
      <motion.div
        layout
        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
        ref={containerRef}
        className={`grid space-y-3 overflow-hidden bg-primary mb-4 rounded-md text-left w-full md:w-[500px] p-4`}
      >
        {!isFocused && (
          <button
            onClick={() => setIsFocused(true)}
            className="w-full text-left hover:cursor-text"
          >
            Create new snippet
          </button>
        )}

        {isFocused && (
          <div className="grid gap-2">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus:outline-none p-2 rounded text-lg font-bold"
              autoFocus
            />

            <textarea
              ref={textareaRef}
              placeholder="Write your snippet here..."
              className="bg-transparent placeholder-zinc-500 focus:outline-none p-2 rounded resize-none min-h-[128px] overflow-hidden text-sm leading-5 w-full"
              value={content}
              onChange={handleTextareaInput}
              spellCheck={false}
            />

            <div className="flex justify-end">
              <button
                className="bg-indigo-500 px-4 py-1 rounded-full hover:bg-indigo-600 text-white hover:cursor-pointer"
                onClick={() => {
                  handleSave();
                  setIsFocused(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SnippetInput;
