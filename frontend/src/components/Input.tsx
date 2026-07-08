const Input = ({
  placeholder,
  className,
  variant = 'primary',
}: {
  placeholder: string;
  className?: string;
  variant?: 'primary' | 'secondary';
}) => {
  return (
    <div className={`relative ${className ?? ''}`}>
      <svg
        className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z'
        />
      </svg>
      <input
        type='text'
        className={`${
          variant == 'primary' ? 'bg-background' : 'bg-secondary'
        } w-full rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-secondary transition-shadow`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
