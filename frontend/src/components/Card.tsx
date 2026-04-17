'use client';

import { motion } from 'framer-motion';

interface CardProps {
  id: string;
  title: string;
  content: string;
  onClick: () => void;
  layoutId?: string;
}

const Card = ({ id, title, content, onClick }: CardProps) => {
  return (
    <motion.div
      layoutId={`card-${id}`}
      onClick={onClick}
      className="bg-primary rounded-md p-4  
                 break-inside-avoid mb-4 max-h-60 overflow-hidden cursor-pointer relative"
    >
      <p className="text-lg font-black mb-2">{title}</p>
      <p className="whitespace-pre-wrap break-words">
        {content.slice(0, 120)}{content.length > 120 && '...'}
      </p>
      {content.length > 120 && (
        <div className="absolute bottom-0 left-0 w-full h-8 pointer-events-none 
                        bg-gradient-to-t from-white dark:from-zinc-800 to-transparent" />
      )}
    </motion.div>
  );
};

export default Card;