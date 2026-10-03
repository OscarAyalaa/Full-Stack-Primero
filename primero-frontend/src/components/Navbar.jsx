import { Link } from "react-router-dom";
import { getUser, logout } from "../auth/auth";

function Navbar() {
  const user = getUser();

  return (
    <nav
      style={{
        padding: "1rem",
        background: "#222",
        color: "#fff",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <Link to="/dashboard" style={{ color: "#fff" }}>
        Dashboard
      </Link>

      <Link to="/tareas" style={{ color: "#fff" }}>
        Tareas
      </Link>

      <Link to="/crearTarea" style={{ color: "#fff" }}>
        CrearTarea
      </Link>

      {user?.role === "Admin" && (
        <Link to="/admin" style={{ color: "#fff" }}>
          Admin
        </Link>
      )}

      <span style={{ marginLeft: "auto" }}>
        👤 {user?.username}
      </span>

      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default Navbar;
