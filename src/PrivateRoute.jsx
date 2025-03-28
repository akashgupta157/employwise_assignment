import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "./ContextAPI/AuthContext";

export default function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);
  return children;
}
