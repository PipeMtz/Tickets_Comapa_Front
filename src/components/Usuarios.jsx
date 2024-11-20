import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Importar modal
import Select from 'react-select'; // Importar react-select para dropdowns
import '../styles/Usuarios.css';

// Configurar el modal para que funcione en cualquier parte de la aplicación
Modal.setAppElement('#root'); 

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoDepartamento, setNuevoDepartamento] = useState(null);
  const [nuevoRol, setNuevoRol] = useState(null);

  // Fetch de usuarios, departamentos y roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usuariosRes, departamentosRes, rolesRes] = await Promise.all([
          axios.get('http://localhost:3000/api/users/detalles'),
          axios.get('http://localhost:3000/api/departamentos'),
          axios.get('http://localhost:3000/api/roles'),
        ]);
        setUsuarios(usuariosRes.data);
        setDepartamentos(departamentosRes.data);
        setRoles(rolesRes.data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  // Abrir modal de edición
  const abrirModal = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNuevoDepartamento(usuario.nombre_departamento || '');
    setNuevoRol(usuario.roles || '');
    setModalVisible(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setUsuarioSeleccionado(null);
    setModalVisible(false);
  };

  // Actualizar usuario
  const actualizarUsuario = async () => {
    if (!usuarioSeleccionado) return;

    try {
      await axios.put(`http://localhost:3000/api/users/${usuarioSeleccionado.id_usuario}/actualizar`, {
        nuevoDepartamento: nuevoDepartamento,
        nuevoRol: nuevoRol,
      });

      // Actualizamos el estado de los usuarios
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id_usuario === usuarioSeleccionado.id_usuario
            ? { ...usuario, nombre_departamento: nuevoDepartamento, roles: nuevoRol }
            : usuario
        )
      );
      cerrarModal(); // Cierra el modal de edición
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (id_usuario) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/users/${id_usuario}`);
      setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id_usuario !== id_usuario));
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  return (
    <div className="usuarios-container">
      <h2>Lista de Usuarios</h2>

      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Departamento</th>
            <th>Rol</th>
            <th>Fecha de Registro</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.nombre_usuario}</td>
              <td>{usuario.email}</td>
              <td>{usuario.telefono || 'N/A'}</td>
              <td>{usuario.nombre_departamento || 'Sin asignar'}</td>
              <td>{usuario.roles || 'Sin roles'}</td>
              <td>{new Date(usuario.fecha_registro).toLocaleDateString()}</td>
              <td>
                <div className="opciones-dropdown">
                  <button>⋮</button>
                  <div className="dropdown-menu">
                    <button onClick={() => abrirModal(usuario)}>Editar</button>
                    <button onClick={() => eliminarUsuario(usuario.id_usuario)}>Borrar</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal con React Modal */}
      <Modal
        isOpen={modalVisible}
        onRequestClose={cerrarModal}
        contentLabel="Editar Usuario"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h3>Editar Usuario</h3>
        <div className="modal-body">
          <label>
            Departamento:
            <Select
              options={departamentos.map((dep) => ({ value: dep.nombre_departamento, label: dep.nombre_departamento }))}
              value={nuevoDepartamento ? { value: nuevoDepartamento, label: nuevoDepartamento } : null}
              onChange={(e) => setNuevoDepartamento(e.value)}
            />
          </label>

          <label>
            Rol:
            <Select
              options={roles.map((rol) => ({ value: rol.nombre_rol, label: rol.nombre_rol }))}
              value={nuevoRol ? { value: nuevoRol, label: nuevoRol } : null}
              onChange={(e) => setNuevoRol(e.value)}
            />
          </label>

          <div className="modal-buttons">
            <button onClick={actualizarUsuario}>Guardar</button>
            <button onClick={cerrarModal}>Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Usuarios;
