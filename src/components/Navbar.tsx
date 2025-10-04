'use client';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { logOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Input from './Input';

const Navbar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='bg-primary p-5 flex content-center justify-between'>
      <div
        className='flex content-center hover:cursor-pointer'
        onClick={() => router.push('/')}
      >
        <h1 className='text-2xl content-center'>Snippets</h1>
        <h1 className='text-2xl font-bold font-italic content-center text-indigo-400'>
          Save
        </h1>
      </div>
      <div className='flex content-center'>
        <button
          onClick={toggleTheme}
          className='p-2 rounded-lg transition-colors'
          aria-label='Toggle theme'
        >
          {theme === 'light' ? (
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
            </svg>
          ) : (
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
                clipRule='evenodd'
              />
            </svg>
          )}
        </button>
        {user && (
          <button
            onClick={handleSignOut}
            className='mr-2 px-4 py-2 rounded hover:cursor-pointer'
          >
            Sign Out
          </button>
        )}
        <Input placeholder='Search snippets' />
      </div>
    </div>
  );
};

export default Navbar;
