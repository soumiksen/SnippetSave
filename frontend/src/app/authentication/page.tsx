'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { signIn, signUp } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const SignInSignUp = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleToggle = (toSignIn: boolean) => {
    if (toSignIn !== isSignIn) {
      setIsSignIn(toSignIn);
      setError('');
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(signInData.email, signInData.password);
      
      if (result.success) {
        console.log('Sign in successful');
        router.push('/snippets');
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signUp(signUpData.email, signUpData.password, signUpData.name);
      
      if (result.success) {
        console.log('Sign up successful');
        router.push('/snippets');
      } else {
        setError(result.error || 'Sign up failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData({
      ...signInData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className='flex h-screen w-full items-center justify-center overflow-hidden -mt-22'>
      <div className='bg-zinc-800 p-6 rounded-lg lg:w-1/3 md:w-1/2 w-full mx-4'>
        <div className='flex items-center justify-center mb-6'>
          <div className='bg-zinc-700 p-1 rounded-full flex gap-1 w-fit hover:cursor-pointer'>
            <button
              onClick={() => handleToggle(true)}
              disabled={isLoading}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors hover:cursor-pointer disabled:cursor-not-allowed ${
                isSignIn ? 'bg-indigo-500 text-white' : 'text-zinc-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleToggle(false)}
              disabled={isLoading}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors hover:cursor-pointer disabled:cursor-not-allowed ${
                !isSignIn ? 'bg-indigo-500 text-white' : 'text-zinc-300'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {error && (
          <div className='bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm'>
            {error}
          </div>
        )}

        <div className='relative w-full h-[260px] overflow-hidden'>
          <motion.div
            className='flex w-[200%] h-full'
            animate={{ x: isSignIn ? '0%' : '-50%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className='w-1/2 pr-2'>
              <form
                onSubmit={handleSignInSubmit}
                className='flex flex-col gap-4 h-full'
              >
                <h1 className='text-2xl font-black text-center text-white'>Sign In</h1>
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  value={signInData.email}
                  onChange={handleSignInChange}
                  className='p-2 rounded-xl focus:outline-none bg-zinc-700 border border-zinc-600 text-white'
                  required
                  disabled={isLoading}
                />
                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={signInData.password}
                  onChange={handleSignInChange}
                  className='p-2 rounded-xl focus:outline-none bg-zinc-700 border border-zinc-600 text-white'
                  required
                  disabled={isLoading}
                />
                <button
                  type='submit'
                  disabled={isLoading}
                  className={`text-white font-bold py-2 px-4 rounded-xl mt-auto transition-colors ${
                    isLoading 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer'
                  }`}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </div>

            <div className='w-1/2 pl-2'>
              <form
                onSubmit={handleSignUpSubmit}
                className='flex flex-col gap-4 h-full'
              >
                <h1 className='text-2xl font-black text-center text-white'>Sign Up</h1>
                <input
                  type='text'
                  name='name'
                  placeholder='Full Name'
                  value={signUpData.name}
                  onChange={handleSignUpChange}
                  className='p-2 rounded-xl focus:outline-none bg-zinc-700 border border-zinc-600 text-white'
                  required
                  disabled={isLoading}
                />
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  className='p-2 rounded-xl focus:outline-none bg-zinc-700 border border-zinc-600 text-white'
                  required
                  disabled={isLoading}
                />
                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                  className='p-2 rounded-xl focus:outline-none bg-zinc-700 border border-zinc-600 text-white'
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type='submit'
                  disabled={isLoading}
                  className={`text-white font-bold py-2 px-4 rounded-xl mt-auto transition-colors ${
                    isLoading 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer'
                  }`}
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;