'use client';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import Input from './Input';

const Navbar = () => {
  const { user, logOut } = useAuth();
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
    <div className='sticky top-0 z-40 bg-primary/80 backdrop-blur-md border-b border-border'>
      <div className='flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5'>
        <div
          className='flex items-center gap-2 hover:cursor-pointer group shrink-0'
          onClick={() => router.push('/')}
        >
          <span className='flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white font-mono text-sm font-bold shadow-sm transition-transform group-hover:scale-105'>
            {'</>'}
          </span>
          <h1 className='text-lg font-bold tracking-tight'>
            Snippet<span className='text-accent'>Save</span>
          </h1>
        </div>

        <div className='flex items-center gap-2 flex-1 justify-end'>
          {user && <Input placeholder='Search snippets' className='max-w-xs hidden sm:block' />}

          <button
            onClick={toggleTheme}
            className='p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-secondary transition-colors hover:cursor-pointer'
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
              className='px-3.5 py-2 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary transition-colors hover:cursor-pointer'
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
