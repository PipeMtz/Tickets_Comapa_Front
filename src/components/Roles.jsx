import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Roles.css';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [nuevoRol, setNuevoRol] = useState('');

  // Cargar roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error al cargar los roles:', error);
      }
    };

    fetchRoles();
  }, []);

  // Crear un nuevo rol
  const crearRol = async () => {
    if (!nuevoRol.trim()) {
      alert('El nombre del rol no puede estar vacío.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/roles', {
        nombre_rol: nuevoRol,
      });
      setRoles((prev) => [...prev, response.data]); // Agregar el nuevo rol a la lista
      setNuevoRol(''); // Limpiar el input
    } catch (error) {
      console.error('Error al crear el rol:', error);
    }
  };

  // Eliminar un rol
  const eliminarRol = async (id_rol) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/roles/${id_rol}`);
      setRoles((prev) => prev.filter((rol) => rol.id_rol !== id_rol)); // Filtrar y eliminar el rol
    } catch (error) {
      console.error('Error al eliminar el rol:', error);
    }
  };

  return (
    <div className="roles-container">
      <h2>Gestión de Roles</h2>

      <div className="crear-rol">
        <input
          type="text"
          placeholder="Nombre del rol"
          value={nuevoRol}
          onChange={(e) => setNuevoRol(e.target.value)}
        />
        <button onClick={crearRol}>Crear Rol</button>
      </div>

      <table className="roles-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => (
            <tr key={rol.id_rol}>
              <td>{rol.id_rol}</td>
              <td>{rol.nombre_rol}</td>
              <td>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarRol(rol.id_rol)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Roles;
