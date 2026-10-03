import { useEffect, useState } from "react";
import api from "../api/api";

function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch {
      setError("Access denied or failed to load users");
    }
  };

  const promote = async (id) => {
    await api.put(`/admin/promover/${id}`);
    loadUsers();
  };

  const demote = async (id) => {
    await api.put(`/admin/degradar/${id}`);
    loadUsers();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/admin/delete/${id}`);
    loadUsers();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Panel</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                {u.role === "User" ? (
                  <button onClick={() => promote(u.id)}> Promote</button>
                ) : (
                  <button onClick={() => demote(u.id)}> Demote</button>
                )}
                <button onClick={() => remove(u.id)}> Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
