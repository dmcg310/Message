const Header = () => {
  return (
    <nav className="text-white bg-opacity-50 p-blur-md p-4 mt-4 fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-2xl font-bold">
          Message
        </a>
        <div className="flex space-x-4">
          <a href="/messages/" className="hover:text-gray-300">
            Messages
          </a>
          <a href="/create-account/" className="hover:text-gray-300">
            Sign up
          </a>
          <a href="/sign-in/" className="hover:text-gray-300">
            Login
          </a>
          <a href="/account/" className="hover:text-gray-300">
            Account
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
