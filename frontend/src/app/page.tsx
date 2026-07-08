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

  const features = [
    {
      title: 'Organized',
      desc: 'Every snippet in one searchable place, no more scattered gists.',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M4 6h16M4 12h16M4 18h7'
        />
      ),
    },
    {
      title: 'Instant Search',
      desc: 'Find the snippet you need in seconds, not scrolling minutes.',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z'
        />
      ),
    },
    {
      title: 'Anywhere Access',
      desc: 'Synced to your account and available on any device you use.',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 3v18M3 9h18M3 15h18'
        />
      ),
    },
  ];

  return (
    <div className='relative min-h-screen w-full overflow-hidden flex flex-col justify-center items-center px-4'>
      <div className='pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full bg-accent/20 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl' />

      <div className='relative flex flex-col items-center'>
        <span className='inline-flex items-center gap-2 bg-accent-soft text-accent text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-accent/20'>
          ✨ Your personal snippet library
        </span>

        <h1 className='text-4xl sm:text-6xl font-extrabold text-center mb-5 tracking-tight max-w-3xl'>
          Save Your Snippets{' '}
          <span className='bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent'>
            With Ease
          </span>
        </h1>

        <p className='text-lg sm:text-xl text-text-secondary text-center mb-9 max-w-2xl'>
          Keep all your snippets organized, searchable, and accessible
          from anywhere.
        </p>

        <button
          onClick={() => router.push('/authentication')}
          className='group bg-accent hover:bg-accent-hover hover:cursor-pointer text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-accent/25 flex items-center gap-2'
        >
          Get Started
          <svg
            className='w-4 h-4 transition-transform group-hover:translate-x-0.5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2.5}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M13 7l5 5m0 0l-5 5m5-5H6' />
          </svg>
        </button>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl w-full'>
          {features.map((f) => (
            <div
              key={f.title}
              className='bg-primary border border-border rounded-2xl p-5 text-left shadow-[var(--card-shadow)]'
            >
              <div className='w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3'>
                <svg
                  className='w-4.5 h-4.5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  {f.icon}
                </svg>
              </div>
              <p className='font-semibold text-text-primary mb-1'>{f.title}</p>
              <p className='text-sm text-text-secondary'>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
