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
    <input
      type='text'
      className={`${
        variant == 'primary' ? 'bg-background' : 'bg-primary'
      } rounded-md focus:outline-none p-2 ${className}`}
      placeholder={placeholder}
    />
  );
};

export default Input;
