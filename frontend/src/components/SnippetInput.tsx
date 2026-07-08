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
        className={`grid space-y-3 overflow-hidden mb-4 rounded-xl text-left w-full md:w-[500px] p-4 border transition-colors ${
          isFocused
            ? 'bg-primary border-accent/40 shadow-[var(--card-shadow)]'
            : 'bg-secondary/60 border-dashed border-border hover:border-accent/40 hover:bg-secondary'
        }`}
      >
        {!isFocused && (
          <button
            onClick={() => setIsFocused(true)}
            className="w-full flex items-center gap-2 text-left text-text-secondary hover:cursor-text"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-soft text-accent text-base leading-none">
              +
            </span>
            Create new snippet
          </button>
        )}

        {isFocused && (
          <div className="grid gap-2">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus:outline-none p-2 rounded-lg text-lg font-bold text-text-primary placeholder:text-text-secondary"
              autoFocus
            />

            <textarea
              ref={textareaRef}
              placeholder="Write your snippet here..."
              className="bg-secondary/50 placeholder-text-secondary focus:outline-none p-2 rounded-lg resize-none min-h-[128px] overflow-hidden text-sm font-mono leading-5 w-full text-text-primary"
              value={content}
              onChange={handleTextareaInput}
              spellCheck={false}
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1.5 rounded-full text-text-secondary hover:bg-secondary hover:cursor-pointer transition-colors"
                onClick={() => setIsFocused(false)}
              >
                Cancel
              </button>
              <button
                className="bg-accent px-4 py-1.5 rounded-full hover:bg-accent-hover text-white font-medium hover:cursor-pointer shadow-sm transition-colors"
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
