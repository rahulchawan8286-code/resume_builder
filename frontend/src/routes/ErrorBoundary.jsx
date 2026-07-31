import React from 'react';
import { useRouteError } from 'react-router-dom';

export const ErrorBoundary = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
      <h1 className="text-3xl font-bold text-red-500">Oops! Something went wrong.</h1>
      <p className="text-gray-500">{error.message || 'An unexpected error occurred.'}</p>
    </div>
  );
};