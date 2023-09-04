const Index = () => {
  return (
    <div
      className="bg-cover bg-center h-screen relative flex items-center justify-center"
      style={{
        backgroundImage: `url("../../assets/index.jpg")`,
      }}
    >
      <nav className="text-white bg-opacity-50 p-blur-md p-4 mt-4 fixed w-full top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-xl font-bold">Message</span>
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

      <div className="text-center">
        <h1 className="text-white text-5xl font-extrabold mb-4">
          Connect with the Universe
        </h1>
        <p className="text-white text-lg mb-6">
          Engage in stellar conversations, make friends from all corners of the
          galaxy.
        </p>
        <a
          href="/messages/"
          className="bg-blue-600 text-white px-6 py-2 rounded-full text-lg hover:bg-blue-800"
        >
          Start Chatting
        </a>
      </div>
    </div>
  );
};

export default Index;
