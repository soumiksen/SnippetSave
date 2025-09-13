'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const SignInSignUp = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const handleToggle = (toSignIn: boolean) => {
    if (toSignIn !== isSignIn) {
      setIsSignIn(toSignIn);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isSignIn ? 'Sign In Submitted' : 'Sign Up Submitted');
  };

  return (
    <div className='flex h-screen w-full items-center justify-center overflow-hidden -mt-22'>
      <div className='bg-zinc-800 p-6 rounded-lg lg:w-1/3 md:w-1/2 w-full mx-4'>
        <div className='flex items-center justify-center mb-6'>
          <div className='bg-zinc-700 p-1 rounded-full flex gap-1 w-fit hover:cursor-pointer'>
            <button
              onClick={() => handleToggle(true)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors hover:cursor-pointer ${
                isSignIn ? 'bg-indigo-500 text-white' : 'text-zinc-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleToggle(false)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors hover:cursor-pointer ${
                !isSignIn ? 'bg-indigo-500 text-white' : 'text-zinc-300'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className='relative w-full h-[260px] overflow-hidden'>
          <motion.div
            className='flex w-[200%] h-full'
            animate={{ x: isSignIn ? '0%' : '-50%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
       
            <div className='w-1/2 pr-2'>
              <form
                onSubmit={handleSubmit}
                className='flex flex-col gap-4 h-full'
              >
                <h1 className='text-2xl font-black text-center'>Sign In</h1>
                <input
                  type='email'
                  placeholder='Email'
                  className='p-2 rounded-xl focus:outline-none bg-zinc-700 border border-zinc-600 text-white'
                  required
                />
                <input
                  type='password'
                  placeholder='Password'
                  className='p-2 rounded-xl focus:outline-none bg-zinc-700 border border-zinc-600 text-white'
                  required
                />
                <button
                  type='submit'
                  className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-xl hover:cursor-pointer mt-auto'
                >
                  Sign In
                </button>
              </form>
            </div>

            <div className='w-1/2 pl-2'>
              <form
                onSubmit={handleSubmit}
                className='flex flex-col gap-4 h-full'
              >
                <h1 className='text-2xl font-black text-center'>Sign Up</h1>
                <input
                  type='text'
                  placeholder='Name'
                  className='p-2 rounded-xl focus:outline-none bg-zinc-700 border border-zinc-600 text-white'
                  required
                />
                <input
                  type='email'
                  placeholder='Email'
                  className='p-2 rounded-xl focus:outline-none bg-zinc-700 border border-zinc-600 text-white'
                  required
                />
                <input
                  type='password'
                  placeholder='Password'
                  className='p-2 rounded-xl focus:outline-none bg-zinc-700 border border-zinc-600 text-white'
                  required
                />
                <button
                  type='submit'
                  className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-xl hover:cursor-pointer mt-auto'
                >
                  Sign Up
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
