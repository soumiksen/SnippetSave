'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push('/snippets');
    return null;
  }

  return (
    <div className='min-h-screen h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-gradient-to-b from-zinc-900 to-zinc-800 text-white px-4'>
      <h1 className='text-4xl sm:text-5xl font-extrabold text-center mb-4'>
        Save Your Code Snippets{' '}
        <span className='text-indigo-500'>With Ease</span>
      </h1>

      <p className='text-lg sm:text-xl text-zinc-300 text-center mb-8 max-w-2xl'>
        Keep all your coding snippets organized, searchable, and accessible from
        anywhere. Focus on coding, not losing your valuable snippets.
      </p>

      <button
        onClick={() => router.push('/authentication')}
        className='bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-lg'
      >
        Get Started
      </button>
    </div>
  );
}
