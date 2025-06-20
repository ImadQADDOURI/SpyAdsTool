"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type NavbarVisibilityContextType = { visible: boolean };
const NavbarVisibilityContext =
  createContext<NavbarVisibilityContextType | null>(null);

export const NavbarVisibilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(true);
  const prevY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(() => {
          const currY = window.scrollY;
          const isDown = currY > prevY.current && currY > 100;
          const isUp = currY < prevY.current;

          // only flip if needed
          setVisible((prev) => (isDown ? false : isUp ? true : prev));

          prevY.current = currY;
          ticking.current = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <NavbarVisibilityContext.Provider value={{ visible }}>
      {children}
    </NavbarVisibilityContext.Provider>
  );
};

export const useNavbarVisibility = () => {
  const ctx = useContext(NavbarVisibilityContext);
  if (!ctx) throw new Error("Must be used within NavbarVisibilityProvider");
  return ctx;
};
