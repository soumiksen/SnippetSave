'use client';

import * as motion from 'motion/react-client';
import { useRef, useState } from 'react';

const SnippetInput = () => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBlur = (e: any) => {
    if (!containerRef?.current?.contains(e.relatedTarget)) {
      setIsFocused(false);
    }
  };

  const commonClasses =
    'bg-zinc-800 mb-4 rounded-md text-left text-zinc-400 w-full md:w-[500px]';

  return (
    <div className='flex justify-center'>
      <motion.div
        layout
        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
        ref={containerRef}
        onBlur={handleBlur}
        tabIndex={-1}
        className={`grid space-y-3 overflow-hidden ${commonClasses} ${
          isFocused ? 'opacity-100 p-4' : 'opacity-90 p-4'
        }`}
      >
        {!isFocused && (
          <button
            onClick={() => setIsFocused(true)}
            className='w-full text-left text-zinc-400 hover:cursor-text'
          >
            Create new snippet
          </button>
        )}

        {isFocused && (
          <div className='grid gap-2'>
            <input
              placeholder='Title'
              className='focus:outline-none p-2 rounded text-white text-lg font-bold'
              autoFocus
            />
            <textarea
              placeholder='Create new snippet'
              className='focus:outline-none p-2 rounded resize-none text-white h-32'
            />
            <div className='flex justify-end'>
              <button className='bg-indigo-500 px-4 py-1 rounded-full hover:bg-indigo-600 hover:cursor-pointer text-white'>
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
