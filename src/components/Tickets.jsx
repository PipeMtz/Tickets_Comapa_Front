import { useEffect, useState } from 'react';
import { Table, Button, Dropdown, Menu, Select, DatePicker, Form, Row, Col, message, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { EyeOutlined, EditOutlined , FileExcelOutlined} from '@ant-design/icons';
import EditTicketModal from './EditTicketModal'; // Asegúrate de que esta ruta sea correcta
import ViewAttachmentsModal from './ViewAttachmentsModal'; // Importa el modal de archivos adjuntos

// import { Form, Row, Col, Select, DatePicker, Button, Table } from 'antd';
import { ConfigProvider } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttachmentsModalOpen, setIsAttachmentsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [filters, setFilters] = useState({});
  const [userRole, setUserRole] = useState(null); // Estado para almacenar el id_rol del usuario

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  const fetchTickets = async () => {
    try {
      // Obtener el token del almacenamiento local
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token. Inicia sesión nuevamente.');
      }
  
      // Decodificar el token para obtener el id_usuario
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id_usuario;
  
      // Hacer una solicitud a /api/users para obtener los datos del usuario
      const userResponse = await axios.get(`http://localhost:3000/api/users/${userId}`);
      const { id_rol } = userResponse.data;
  
      // Decidir qué endpoint llamar según el id_rol
      const endpoint =
        id_rol === 1 || id_rol === 2
          ? 'http://localhost:3000/api/tickets'
          : `http://localhost:3000/api/tickets/usuario/${userId}`;
  
      // Hacer la solicitud al endpoint seleccionado
      const ticketsResponse = await axios.get(endpoint);
      setTickets(ticketsResponse.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      message.error('No se pudieron cargar las solicitudes.');
    }
  };
  

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAttachments = async (ticketId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/tickets/${ticketId}/attachments`);
      setAttachments(response.data);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      message.error('No se pudieron cargar los adjuntos.');
    }
  };

  const applyFilters = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tickets/filtered', { params: filters });
      setTickets(response.data);
    } catch (error) {
      console.error('Error al aplicar filtros:', error);
      message.error('No se pudieron aplicar los filtros.');
    }
  };

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.post(
        'http://localhost:3000/api/tickets/export', 
        tickets, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tickets.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      message.error('No se pudo exportar a Excel.');
    }
  };

  const handleMenuClick = (e, ticket) => {
    if (e.key === 'edit') {
      showModal(ticket);
    } else if (e.key === 'view') {
      showAttachmentsModal(ticket);
    }
  };

  const menu = (ticket) => (
    <Menu onClick={(e) => handleMenuClick(e, ticket)}>
      {userRole !== 3 && ( // Ocultar opción "Editar" si el rol es 3
        <Menu.Item key="edit" icon={<EditOutlined />}>
          Editar
        </Menu.Item>
      )}
      <Menu.Item key="view" icon={<EyeOutlined />}>
        Ver detalles
      </Menu.Item>
    </Menu>
  );


  const columns = [
    {
      title: 'ID Ticket',
      dataIndex: 'id_ticket',
      key: 'id_ticket',
      sorter: (a, b) => a.id_ticket - b.id_ticket,
    },
    {
      title: 'Nombre Usuario',
      dataIndex: 'nombre',
      key: 'nombre',
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
    },
    {
      title: 'Solicitud',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      key: 'direccion',
    },
    {
      title: 'Asignado a',
      dataIndex: 'nombre_asignado',
      key: 'nombre_asignado',
      render: (nombre_asignado) => nombre_asignado || 'No asignado',
    },
    ...(userRole !== 3
      ? [
          // Columna de prioridad solo si el rol no es 3
          {
            title: 'Prioridad',
            dataIndex: 'prioridad',
            key: 'prioridad',
            render: (prioridad) => (
              <span
                style={{
                  color:
                    prioridad === 'Alta'
                      ? 'red'
                      : prioridad === 'Media'
                      ? 'orange'
                      : 'green',
                  fontWeight: 'bold',
                }}
              >
                {prioridad}
              </span>
            ),
          },
        ]
      : []),
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
    },
    {
      title: 'Departamento',
      dataIndex: 'nombre_departamento',
      key: 'nombre_departamento',
    },
    {
      title: 'Fecha Creación',
      dataIndex: 'fecha_creacion',
      key: 'fecha_creacion',
      render: (fecha) => moment(fecha).format('DD/MM/YYYY'),
    },
    {
      title: 'Opciones',
      key: 'opciones',
      render: (_, record) => (
        <Dropdown overlay={menu(record)}>
          <Button type="link">Opciones</Button>
        </Dropdown>
      ),
    },
  ];

  const showModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
    setIsModalOpen(false);
  };

  const showAttachmentsModal = (ticket) => {
    setSelectedTicket(ticket);  // Set selected ticket for attachments modal
    setIsAttachmentsModalOpen(true);  // Open the modal
  };

  const handleCloseAttachmentsModal = () => {
    setIsAttachmentsModalOpen(false);
    setAttachments([]);
  };



  const guindaColor = '#800000'; // Define el color guinda
  
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: guindaColor, // Cambia el color primario global
          colorLink: guindaColor, // Cambia el color de los enlaces
        },
      }}
    >
      <div className="tickets-container">
        <h2>Solicitudes</h2>
        <Form
          layout="vertical"
          onValuesChange={(changedValues, allValues) => setFilters(allValues)}
          onFinish={applyFilters}
        >
          <Row gutter={16}>
            {/* Departamento */}
            <Col span={4}>
              <Form.Item name="departamento" label="Departamento">
                <Select placeholder="Seleccione un departamento">
                  <Option value="Todo">Todos</Option>
                  <Option value="Alcantarillado">Alcantarillado</Option>
                  <Option value="Drenaje">Drenaje</Option>
                </Select>
              </Form.Item>
            </Col>
  
            {/* Prioridad */}
            <Col span={4}>
              <Form.Item name="prioridad" label="Prioridad">
                <Select placeholder="Seleccione una prioridad">
                  <Option value="Todo">Todas</Option>
                  <Option value="Alta">Alta</Option>
                  <Option value="Media">Media</Option>
                  <Option value="Baja">Baja</Option>
                </Select>
              </Form.Item>
            </Col>
  
            {/* Fechas */}
            <Col span={6}>
              <Form.Item name="fecha" label="Rango de fechas">
                <RangePicker
                  format="YYYY-MM-DD"
                  onChange={(dates, dateStrings) => {
                    setFilters((prev) => ({
                      ...prev,
                      fechaInicio: dateStrings[0],
                      fechaFin: dateStrings[1],
                    }));
                  }}
                />
              </Form.Item>
            </Col>
  
            {/* Filtrar */}
            <Col span={4}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginTop: '32px', width: '100%' }}
              >
                Filtrar
              </Button>
            </Col>
  
            {/* Exportar a Excel */}
            <Col span={6}>
              <Button
                type="default"
                onClick={exportToExcel}
                style={{ marginTop: '32px', width: '100%' }}
                icon={<FileExcelOutlined />}
              >
                Exportar a Excel
              </Button>
            </Col>
          </Row>
        </Form>
  
        {/* Tabla */}
        <Table
          dataSource={tickets}
          columns={columns}
          rowKey="id_ticket"
          pagination={{ pageSize: 10 }}
        />
  
        {/* Modal de edición */}
        {isModalOpen && (
          <EditTicketModal
            visible={isModalOpen}
            onClose={handleCloseModal}
            ticket={selectedTicket}
            users={users}
            fetchTickets={fetchTickets}
          />
        )}
  
        {/* Modal de adjuntos */}
        {isAttachmentsModalOpen && (
          <ViewAttachmentsModal
            visible={isAttachmentsModalOpen}
            onClose={handleCloseAttachmentsModal}
            ticket={selectedTicket}
            fetchAttachments={fetchAttachments} // Fetch attachments when the modal opens
          />
        )}
      </div>
    </ConfigProvider>
  );
  

};

export default Tickets;
