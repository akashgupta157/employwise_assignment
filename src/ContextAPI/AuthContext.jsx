import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("isLoggedIn"))?.isLoggedIn || false
  );
  const login = ({ token }) => {
    setIsLoggedIn(true);
    localStorage.setItem(
      "isLoggedIn",
      JSON.stringify({
        token,
        isLoggedIn: true,
      })
    );
  };
  return (
    <AuthContext.Provider value={{ isLoggedIn, login }}>
      {children}
    </AuthContext.Provider>
  );
};
