import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface DarkModeContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(
  undefined
);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context)
    throw new Error("useDarkMode must be used within DarkModeProvider");
  return context;
};

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  // On mount, check localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      setDarkMode(stored === "true");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }

    // Listen for system changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("darkMode") === null) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Save to localStorage and update <html> class
  useEffect(() => {
    if (darkMode === null) return;
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  if (darkMode === null) return null;

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
