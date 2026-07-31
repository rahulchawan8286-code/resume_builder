import React, { useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { THEME } from '../../constants/theme';

export const ThemeProvider = ({ children }) => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (theme === THEME.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};