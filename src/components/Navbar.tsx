'use client';
import { useAuth } from '@/context/AuthContext';
import { logOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Input from './Input';

const Navbar = () => {
  const { user } = useAuth();
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
    <div className='bg-zinc-800 p-5 flex content-center justify-between'>
      <div className='flex content-center hover:cursor-pointer' onClick={() => router.push('/')}>
        <h1 className='text-2xl content-center'>Snippets</h1>
        <h1 className='text-2xl font-bold font-italic content-center text-indigo-400'>
          Save
        </h1>
      </div>
      <div>
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
