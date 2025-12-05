"use client";

import { createContext, useContext, useState } from "react";

const DrawerContext = createContext<{
  isOpen: boolean;
  toggleDrawer: () => void;
}>({
  isOpen: false,
  toggleDrawer: () => {},
});

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setOpen(!isOpen);
  };

  return (
    <DrawerContext.Provider value={{ isOpen, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => useContext(DrawerContext);
