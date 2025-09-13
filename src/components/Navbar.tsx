import Input from './Input';

const Navbar = () => {
  return (
    <div className='bg-zinc-800 p-5 flex content-center justify-between'>
      <div className='flex content-center'>
        <h1 className='text-2xl content-center'>Snippets</h1>
        <h1 className='text-2xl font-bold font-italic content-center text-indigo-400'>
          Save
        </h1>
      </div>
      <Input placeholder='Search snippets' />
    </div>
  );
};

export default Navbar;
