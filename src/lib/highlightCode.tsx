import { JSX } from 'react';

export type Token = { type: string; value: string };

export const highlightCode = (
  code: string,
  language: string
): JSX.Element[] => {
  if (!code) return [];

  const lines = code.split('\n');

  const highlightLine = (line: string, lang: string): JSX.Element[] => {
    if (!line.trim()) return [<span key={0}>&nbsp;</span>];

    const tokens: Token[] = [];
    const jsKeywords = [
      'const',
      'let',
      'var',
      'function',
      'return',
      'if',
      'else',
      'for',
      'while',
      'class',
      'import',
      'export',
      'from',
      'default',
      'async',
      'await',
      'try',
      'catch',
      'finally',
      'throw',
      'new',
      'this',
      'super',
      'extends',
    ];

    const pyKeywords = [
      'def',
      'class',
      'if',
      'elif',
      'else',
      'for',
      'while',
      'try',
      'except',
      'finally',
      'with',
      'as',
      'import',
      'from',
      'return',
      'yield',
      'lambda',
      'and',
      'or',
      'not',
      'in',
      'is',
      'None',
      'True',
      'False',
      'pass',
      'break',
      'continue',
    ];

    const words = line.split(/(\s+|[^\w\s])/);

    words.forEach((word) => {
      if (
        (lang === 'javascript' || lang === 'typescript') &&
        jsKeywords.includes(word)
      ) {
        tokens.push({ type: 'keyword', value: word });
      } else if (lang === 'python' && pyKeywords.includes(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (
        /^['"`].*['"`]$/.test(word) ||
        word.startsWith('//') ||
        word.startsWith('#')
      ) {
        tokens.push({
          type:
            word.startsWith('//') || word.startsWith('#')
              ? 'comment'
              : 'string',
          value: word,
        });
      } else if (/^\d+\.?\d*$/.test(word)) {
        tokens.push({ type: 'number', value: word });
      } else {
        tokens.push({ type: 'text', value: word });
      }
    });

    return tokens.map((token, index) => {
      switch (token.type) {
        case 'keyword':
          return (
            <span key={index} className='text-blue-400'>
              {token.value}
            </span>
          );
        case 'string':
          return (
            <span key={index} className='text-green-400'>
              {token.value}
            </span>
          );
        case 'comment':
          return (
            <span key={index} className='text-gray-500'>
              {token.value}
            </span>
          );
        case 'number':
          return (
            <span key={index} className='text-yellow-400'>
              {token.value}
            </span>
          );
        default:
          return (
            <span key={index} className='text-white'>
              {token.value}
            </span>
          );
      }
    });
  };

  const highlighted: JSX.Element[] = [];
  lines.forEach((line, i) => {
    highlighted.push(
      <div key={i} className='leading-5'>
        {highlightLine(line, language)}
      </div>
    );
  });

  return highlighted;
};
