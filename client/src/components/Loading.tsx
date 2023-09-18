import React from "react";

const Loading: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return <>{isLoading && <p className="text-white text-2xl">Loading...</p>}</>;
};

export default Loading;
