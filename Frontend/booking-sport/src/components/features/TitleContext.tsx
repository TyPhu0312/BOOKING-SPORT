import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface TitleContextProps {
  title: string;
  setTitle: (title: string) => void;
}

const TitleContext = createContext<TitleContextProps | undefined>(undefined);

export const TitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<string>("ALL");

  // Lưu title vào localStorage
  useEffect(() => {
    const storedTitle = localStorage.getItem("title");
    if (storedTitle) setTitle(storedTitle);
  }, []);

  const handleSetTitle = (newTitle: string) => {
    setTitle(newTitle);
    localStorage.setItem("title", newTitle); // Lưu vào localStorage
  };

  return (
    <TitleContext.Provider value={{ title, setTitle: handleSetTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitle = () => {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error("useTitle must be used within a TitleProvider");
  }
  return context;
};
