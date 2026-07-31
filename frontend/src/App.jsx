import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { AuthProvider } from './components/providers/AuthProvider';
import { ToastProvider } from './components/providers/ToastProvider';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastProvider />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;