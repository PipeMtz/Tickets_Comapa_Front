import { useEffect, useState } from 'react';
import { Table, Button, Modal, Select, Form, Typography, Space, Row, Col } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [form] = Form.useForm();

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

  const abrirModal = (usuario) => {
    setUsuarioSeleccionado(usuario);
    form.setFieldsValue({
      nuevoDepartamento: usuario.nombre_departamento,
      nuevoRol: usuario.roles,
    });
    setModalVisible(true);
  };

  const cerrarModal = () => {
    form.resetFields();
    setUsuarioSeleccionado(null);
    setModalVisible(false);
  };

  const actualizarUsuario = async () => {
    try {
      const values = form.getFieldsValue();
      await axios.put(`http://localhost:3000/api/users/${usuarioSeleccionado.id_usuario}/actualizar`, {
        nuevoDepartamento: values.nuevoDepartamento,
        nuevoRol: values.nuevoRol,
      });

      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id_usuario === usuarioSeleccionado.id_usuario
            ? { ...usuario, nombre_departamento: values.nuevoDepartamento, roles: values.nuevoRol }
            : usuario
        )
      );
      cerrarModal();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  const eliminarUsuario = async (id_usuario) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${id_usuario}`);
      setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id_usuario !== id_usuario));
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const columns = [
    {
      title: 'ID Usuario',
      dataIndex: 'id_usuario',
      key: 'id_usuario',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre_usuario',
      key: 'nombre_usuario',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
      render: (telefono) => telefono || 'N/A',
    },
    {
      title: 'Departamento',
      dataIndex: 'nombre_departamento',
      key: 'nombre_departamento',
      render: (dep) => dep || 'Sin asignar',
    },
    {
      title: 'Rol',
      dataIndex: 'roles',
      key: 'roles',
      render: (rol) => rol || 'Sin roles',
    },
    {
      title: 'Fecha de Registro',
      dataIndex: 'fecha_registro',
      key: 'fecha_registro',
      render: (fecha) => moment(fecha).format('DD/MM/YYYY'),
    },
    {
      title: 'Opciones',
      key: 'opciones',
      render: (_, usuario) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => abrirModal(usuario)}
          >
            Editar
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => eliminarUsuario(usuario.id_usuario)}
          >
            Borrar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="usuarios-container">
      <h2>Lista de Usuarios</h2>
      <Table
        dataSource={usuarios}
        columns={columns}
        rowKey="id_usuario"
        pagination={{ pageSize: 20 }}
        bordered
      />

      <Modal
        title="Editar Usuario"
        visible={modalVisible}
        onCancel={cerrarModal}
        onOk={form.submit}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} onFinish={actualizarUsuario} layout="vertical">
          <Form.Item
            label="Departamento"
            name="nuevoDepartamento"
            rules={[{ required: true, message: 'El departamento es obligatorio' }]}
          >
            <Select placeholder="Seleccione un departamento">
              {departamentos.map((dep) => (
                <Select.Option key={dep.nombre_departamento} value={dep.nombre_departamento}>
                  {dep.nombre_departamento}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Rol"
            name="nuevoRol"
            rules={[{ required: true, message: 'El rol es obligatorio' }]}
          >
            <Select placeholder="Seleccione un rol">
              {roles.map((rol) => (
                <Select.Option key={rol.nombre_rol} value={rol.nombre_rol}>
                  {rol.nombre_rol}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Usuarios;
