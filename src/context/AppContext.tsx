import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AppContextType {
  userName: string;
  setUserName: (v: string) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

const AppContext = createContext<AppContextType>({
  userName: "Mayank",
  setUserName: () => {},
  darkMode: false,
  setDarkMode: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState("Mayank");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <AppContext.Provider value={{ userName, setUserName, darkMode, setDarkMode }}>
      {children}
    </AppContext.Provider>
  );
};
