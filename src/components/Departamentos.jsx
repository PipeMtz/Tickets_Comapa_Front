import { useState, useEffect } from "react";
import { Table, Input, Button, Modal, message, ConfigProvider } from "antd";
import axios from "axios";
import "../styles/Departamentos.css";

const Departamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [nuevoDepartamento, setNuevoDepartamento] = useState("");
  const [loading, setLoading] = useState(false);

  const guindaColor = '#800000'; // Define el color guinda

  // Cargar departamentos
  useEffect(() => {
    const fetchDepartamentos = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/departamentos");
        setDepartamentos(response.data);
      } catch (error) {
        console.error("Error al cargar los departamentos:", error);
        message.error("Error al cargar los departamentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartamentos();
  }, []);

  // Crear un nuevo departamento
  const crearDepartamento = async () => {
    if (!nuevoDepartamento.trim()) {
      message.warning("El nombre del departamento no puede estar vacío.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/departamentos", {
        nombre_departamento: nuevoDepartamento,
      });
      setDepartamentos((prev) => [...prev, response.data]); // Agregar el nuevo departamento a la lista
      setNuevoDepartamento(""); // Limpiar el input
      message.success("Departamento creado exitosamente.");
    } catch (error) {
      console.error("Error al crear el departamento:", error);
      message.error("Error al crear el departamento.");
    }
  };

  // Eliminar un departamento
  const eliminarDepartamento = async (id_departamento) => {
    Modal.confirm({
      title: "¿Estás seguro de que deseas eliminar este departamento?",
      okText: "Sí",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/api/departamentos/${id_departamento}`);
          setDepartamentos((prev) =>
            prev.filter((departamento) => departamento.id_departamento !== id_departamento)
          );
          message.success("Departamento eliminado exitosamente.");
        } catch (error) {
          console.error("Error al eliminar el departamento:", error);
          message.error("Error al eliminar el departamento.");
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id_departamento",
      key: "id_departamento",
    },
    {
      title: "Nombre",
      dataIndex: "nombre_departamento",
      key: "nombre_departamento",
    },
    {
      title: "Opciones",
      key: "acciones",
      render: (_, record) => (
        <Button
          type="primary"  // Botón con color primario guinda
          danger
          onClick={() => eliminarDepartamento(record.id_departamento)}
        >
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: guindaColor, // Cambiar el color primario a guinda
          colorLink: guindaColor,    // Cambiar el color de los enlaces
        },
      }}
    >
      <div className="departamentos-container">
        <h2>Gestión de Departamentos</h2>

        <div className="crear-departamento" style={{ marginBottom: "16px" }}>
          <Input
            placeholder="Nombre del departamento"
            value={nuevoDepartamento}
            onChange={(e) => setNuevoDepartamento(e.target.value)}
            style={{ width: "300px", marginRight: "8px" }}
          />
          <Button 
            type="primary"  // Botón con el color primario guinda
            onClick={crearDepartamento}
          >
            Crear Departamento
          </Button>
        </div>

        <Table
          dataSource={departamentos}
          columns={columns}
          rowKey="id_departamento"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </ConfigProvider>
  );
};

export default Departamentos;
