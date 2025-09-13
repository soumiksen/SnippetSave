'use client';

import Card from '@/components/Card';
import SnippetInput from '@/components/SnippetInput';

const snippetsData = [
  { title: 'Common npm commands', content: 'npm run dev' },
  { title: 'Common python commands', content: 'python main.py' },
  { title: 'Common C++ commands', content: 'g++ main.cpp -o main && ./main' },
];

const Snippets = () => {
  return (
    <div className='grid py-5'>
      <SnippetInput />
      <div className='columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4'>
        {snippetsData.map((snippet, index) => (
          <Card key={index} title={snippet.title} content={snippet.content} />
        ))}
      </div>
    </div>
  );
};

export default Snippets;
