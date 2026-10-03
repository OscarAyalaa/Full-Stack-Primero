import { useEffect, useState } from "react";
import api from "../api/api";

function Tareas() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);  
    const [editData, setEditData] = useState({
        titulo: "",
        descripcion: "",
        completado: false,
    });


    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const res = await api.get("/tarea");
            setTasks(res.data);
        } catch {
            setError(" Failed to load tasks");
        }
    };

    const deleteTask = async (id) => {
        await api.delete(`/tarea/${id}`);
        loadTasks();
    };

    const startEdit = (task) => {
        setEditingId(task.id);
        setEditData({
            titulo: task.titulo,
            descripcion: task.descripcion,
            completado: task.completado,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const updateTask = async (id) => {
        await api.put(`/tarea/${id}`, editData);
        setEditingId(null);
        loadTasks();
    };

    const toggleCompleted = async (task) => {
        await api.put(`/tarea/${task.id}`, {
            ...task,
            completado: !task.completado,
        });
        loadTasks();
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Tasks</h2>

            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Done</th>
                        <th>User</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {tasks.map((t) => (
                        <tr key={t.id}>
                            <td>{t.id}</td>

                            <td>
                                {editingId === t.id ? (
                                    <input
                                        value={editData.titulo}
                                        onChange={(e) =>
                                            setEditData({ ...editData, titulo: e.target.value })
                                        }
                                    />
                                ) : (
                                    t.titulo
                                )}
                            </td>

                            <td>
                                {editingId === t.id ? (
                                    <input
                                        value={editData.descripcion}
                                        onChange={(e) =>
                                            setEditData({ ...editData, descripcion: e.target.value })
                                        }
                                    />
                                ) : (
                                    t.descripcion
                                )}
                            </td>

                            <td>
                                <input
                                    type="checkbox"
                                    checked={t.completado}
                                    onChange={() => toggleCompleted(t)}
                                />
                            </td>

                            <td>{t.username}</td>

                            <td>
                                {editingId === t.id ? (
                                    <>
                                        <button onClick={() => updateTask(t.id)}>Guardar</button>
                                        <button onClick={cancelEdit}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEdit(t)}>Editar</button>
                                        <button onClick={() => deleteTask(t.id)}>Eliminar</button>
                                    </>
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Tareas;