import "./index.css";
import App from "./App.jsx";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import { createRoot } from "react-dom/client";
import { Toaster } from "./components/ui/sonner";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./ContextAPI/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <App />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
    <Toaster />
  </BrowserRouter>
);
