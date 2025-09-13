'use client';

const Card = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className='bg-zinc-800 rounded-md p-4 shadow-lg shadow-neutral-950 break-inside-avoid mb-4'>
      <p className='text-lg font-black'>{title}</p>
      <p>{content}</p>
    </div>
  );
};

export default Card;
