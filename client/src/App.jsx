import { useEffect } from 'react';
import { AppRouter } from './routes';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import ErrorBoundary from './components/shared/ErrorBoundary';

function App() {
  const initTheme = useThemeStore((state) => state.initTheme);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    console.log('[App] Starting initialization');
    initTheme();
    console.log('[App] checkAuth start');
    checkAuth().then(() => {
      console.log('[App] checkAuth end');
    });
  }, [initTheme, checkAuth]);

  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
