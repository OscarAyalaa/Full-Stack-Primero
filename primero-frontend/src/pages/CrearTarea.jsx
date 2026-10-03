import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function CrearTarea() {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const registrarTarea = async (e) => {
        e.preventDefault();
        try {
            await api.post("/tarea", {
                titulo,
                descripcion,
                completado: false,
            });
            navigate("/tareas");
        } catch {
            setError("Se encontro un problema");
        }
    }

    return (

        <div style={{ padding: "2rem" }}>
            <h2>Tasks</h2>

            {/* CREATE */}
            <form onSubmit={registrarTarea}>
                <input
                    placeholder="Title"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                />
                <br /><br />

                <input
                    placeholder="Description"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                />
                <br /><br />

                <button>Agrgar tarea</button>
            </form>
        </div>
    );
}

export default CrearTarea;