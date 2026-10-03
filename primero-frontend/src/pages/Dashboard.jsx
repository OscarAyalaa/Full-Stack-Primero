import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>

      {user && (
        <>
          <p><strong>User:</strong> {user.username}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </>
      )}
    </div>
  );
}

export default Dashboard;
