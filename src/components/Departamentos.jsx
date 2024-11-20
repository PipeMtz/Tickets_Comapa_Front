import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Departamentos.css';

const Departamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [nuevoDepartamento, setNuevoDepartamento] = useState('');

  // Cargar departamentos
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/departamentos');
        setDepartamentos(response.data);
      } catch (error) {
        console.error('Error al cargar los departamentos:', error);
      }
    };

    fetchDepartamentos();
  }, []);

  // Crear un nuevo departamento
  const crearDepartamento = async () => {
    if (!nuevoDepartamento.trim()) {
      alert('El nombre del departamento no puede estar vacío.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/departamentos', {
        nombre_departamento: nuevoDepartamento,
      });
      setDepartamentos((prev) => [...prev, response.data]); // Agregar el nuevo departamento a la lista
      setNuevoDepartamento(''); // Limpiar el input
    } catch (error) {
      console.error('Error al crear el departamento:', error);
    }
  };

  // Eliminar un departamento
  const eliminarDepartamento = async (id_departamento) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/departamentos/${id_departamento}`);
      setDepartamentos((prev) =>
        prev.filter((departamento) => departamento.id_departamento !== id_departamento)
      ); // Filtrar y eliminar el departamento
    } catch (error) {
      console.error('Error al eliminar el departamento:', error);
    }
  };

  return (
    <div className="departamentos-container">
      <h2>Gestión de Departamentos</h2>

      <div className="crear-departamento">
        <input
          type="text"
          placeholder="Nombre del departamento"
          value={nuevoDepartamento}
          onChange={(e) => setNuevoDepartamento(e.target.value)}
        />
        <button onClick={crearDepartamento}>Crear Departamento</button>
      </div>

      <table className="departamentos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {departamentos.map((departamento) => (
            <tr key={departamento.id_departamento}>
              <td>{departamento.id_departamento}</td>
              <td>{departamento.nombre_departamento}</td>
              <td>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarDepartamento(departamento.id_departamento)}
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

export default Departamentos;
