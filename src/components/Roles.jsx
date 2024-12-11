import { useState, useEffect } from "react";
import { Table, Input, Button, Modal, message } from "antd";
import axios from "axios";
import "../styles/Roles.css";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [nuevoRol, setNuevoRol] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar roles
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error al cargar los roles:", error);
        message.error("Error al cargar los roles.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Crear un nuevo rol
  const crearRol = async () => {
    if (!nuevoRol.trim()) {
      message.warning("El nombre del rol no puede estar vacío.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/roles", {
        nombre_rol: nuevoRol,
      });
      setRoles((prev) => [...prev, response.data]); // Agregar el nuevo rol a la lista
      setNuevoRol(""); // Limpiar el input
      message.success("Rol creado exitosamente.");
    } catch (error) {
      console.error("Error al crear el rol:", error);
      message.error("Error al crear el rol.");
    }
  };

  // Eliminar un rol
  const eliminarRol = async (id_rol) => {
    Modal.confirm({
      title: "¿Estás seguro de que deseas eliminar este rol?",
      okText: "Sí",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/api/roles/${id_rol}`);
          setRoles((prev) => prev.filter((rol) => rol.id_rol !== id_rol));
          message.success("Rol eliminado exitosamente.");
        } catch (error) {
          console.error("Error al eliminar el rol:", error);
          message.error("Error al eliminar el rol.");
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id_rol",
      key: "id_rol",
    },
    {
      title: "Nombre",
      dataIndex: "nombre_rol",
      key: "nombre_rol",
    },
    {
      title: "Opciones",
      key: "acciones",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          onClick={() => eliminarRol(record.id_rol)}
        >
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <div className="roles-container">
      <h2>Gestión de Roles</h2>

      <div className="crear-rol" style={{ marginBottom: "16px" }}>
        <Input
          placeholder="Nombre del rol"
          value={nuevoRol}
          onChange={(e) => setNuevoRol(e.target.value)}
          style={{ width: "300px", marginRight: "8px" }}
        />
        <Button type="primary" onClick={crearRol}>
          Crear Rol
        </Button>
      </div>

      <Table
        dataSource={roles}
        columns={columns}
        rowKey="id_rol"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Roles;
