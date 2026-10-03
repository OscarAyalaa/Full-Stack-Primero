import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import { getUser } from "./auth/auth";
import Tareas from "./pages/Tareas";
import CrearTarea from "./pages/CrearTarea";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => {
      setIsAuth(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <BrowserRouter>
      {isAuth && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route 
          path="/tareas"
          element={isAuth ? <Tareas /> : <Navigate to="/login"/>}
        /> 

        <Route
          path="/crearTarea"
          element={isAuth ? <CrearTarea/> : <Navigate to="/login"/>}
        />

        <Route
          path="/admin"
          element={
            isAuth && getUser()?.role === "Admin"
              ? <Admin />
              : <Navigate to="/dashboard" />
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
