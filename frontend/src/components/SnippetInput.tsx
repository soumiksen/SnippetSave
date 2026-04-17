'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { highlightCode } from '@/lib/highlightCode';

interface SnippetInputProps {
  code: string;
  setCode: (code: string) => void;
  title: string;
  setTitle: (title: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  handleSave: () => void;
}

const SnippetInput = ({ code, setCode, title, setTitle, language, setLanguage, handleSave }: SnippetInputProps) => {
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
    const value = e.target.value;
    setCode(value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(textarea.scrollHeight, 128) + 'px';
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

  const renderHighlightedCode = () => highlightCode(code, language);

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

            <div className="relative rounded">
              <div
                className="absolute top-0 left-0 p-2 font-mono text-sm pointer-events-none whitespace-pre-wrap overflow-hidden w-full"
                style={{ minHeight: '128px', wordWrap: 'break-word' }}
              >
                {renderHighlightedCode()}
              </div>

              <textarea
                ref={textareaRef}
                placeholder={`Write your ${language} code here...`}
                className="relative bg-transparent placeholder-zinc-500 focus:outline-none p-2 rounded resize-none caret-white min-h-[128px] overflow-hidden font-mono text-sm leading-5 w-full"
                value={code}
                onChange={handleTextareaInput}
                onKeyDown={handleTextareaKeyDown}
                spellCheck={false}
              />
            </div>

            <div className="flex justify-between">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-indigo-500 border border-indigo-500 px-2 py-1 appearance-none rounded-full text-sm w-24 text-center focus:outline-none hover:cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="plaintext">Plain Text</option>
              </select>

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
