import create from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeState = create(
  persist(
    (set) => ({
      theme: 'theme-white',
      setTheme: (nTheme) => {
        document.querySelector('body').className = nTheme;
        set(() => ({
          theme: nTheme,
        }));
      },
    }),
    {
      name: 'theme-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useThemeState;
