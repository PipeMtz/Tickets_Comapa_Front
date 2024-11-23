import { useEffect, useState } from 'react';
import { Modal, Card, Table, Button, Select, DatePicker, Space, Form, Row, Col, Typography, Dropdown, Menu } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { FilterOutlined, SearchOutlined, DownloadOutlined, CloseOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isFilterCardOpen, setIsFilterCardOpen] = useState(false);
  const [modalMode, setModalMode] = useState('details'); // Nuevo estado para el modo del modal (detalles o editar)
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async (filters = {}) => {
    try {
      const response = await axios.get('http://localhost:3000/api/tickets', { params: filters });
      // Asumiendo que el API devuelve asignaciones de usuarios por ticket
      const tickets = response.data.map(ticket => ({
        ...ticket,
        asignado_a: ticket.id_usuario_asignado ? getUserNameById(ticket.id_usuario_asignado) : 'No asignado',
      }));
      setTickets(tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleExportToExcel = async () => {
    const filters = form.getFieldsValue();
    try {
      const response = await axios.get('http://localhost:3000/api/tickets/export', {
        params: filters,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tickets.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  const getUserNameById = (id) => {
    // Aquí debes implementar la lógica para obtener el nombre del usuario basado en el id
    // Por ahora, devolveré un nombre de ejemplo
    return 'Usuario ' + id;
  };

  const handleMenuClick = (e, ticket) => {
    if (e.key === 'edit') {
      showModal(ticket, 'edit');
    } else if (e.key === 'view') {
      showModal(ticket, 'details');
    }
  };

  const menu = (ticket) => (
    <Menu onClick={(e) => handleMenuClick(e, ticket)}>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Editar
      </Menu.Item>
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
    },
    {
      title: 'Nombre Usuario',
      dataIndex: 'nombre',
      key: 'nombre',
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
      dataIndex: 'asignado_a',
      key: 'asignado_a',
    },
    {
      title: 'Prioridad',
      dataIndex: 'prioridad',
      key: 'prioridad',
      render: (prioridad) => (
        <span
          style={{
            color: prioridad === 'Alta' ? 'red' : prioridad === 'Media' ? 'orange' : 'green',
            fontWeight: 'bold',
          }}
        >
          {prioridad}
        </span>
      ),
    },
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
          <Button type="link">
            Opciones
          </Button>
        </Dropdown>
      ),
    },
  ];

  const showModal = (ticket, mode) => {
    setSelectedTicket(ticket);
    setModalMode(mode); // Establecer el modo del modal (detalles o editar)
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
    setIsModalOpen(false);
  };

  const handleSaveEdit = async () => {
    const updatedData = form.getFieldsValue();
    try {
      await axios.put(`http://localhost:3000/api/tickets/${selectedTicket.id_ticket}`, updatedData);
      fetchTickets(); // Actualizar la lista de tickets
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar el ticket:', error);
    }
  };

  return (
    <div className="tickets-container">
      <h2>Solicitudes</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button type="primary" icon={<FilterOutlined />} onClick={() => setIsFilterCardOpen(!isFilterCardOpen)}>
          Filtros
        </Button>
      </div>

      {isFilterCardOpen && (
        <Card title="Filtrar Tickets" style={{ marginBottom: '20px' }}>
          <Form form={form} onFinish={fetchTickets}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="Departamento" name="departamento">
                    <Select placeholder="Todos" style={{ width: '100%' }}>
                      <Select.Option value="Todos">Todos</Select.Option>
                      <Select.Option value="Alcantarillado">Alcantarillado</Select.Option>
                      <Select.Option value="Drenaje">Drenaje</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Tipo" name="tipo">
                    <Select placeholder="Todos" style={{ width: '100%' }}>
                      <Select.Option value="Todos">Todos</Select.Option>
                      <Select.Option value="Socavon">Socavón</Select.Option>
                      <Select.Option value="Fuga">Fuga de agua</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Prioridad" name="prioridad">
                    <Select placeholder="Todos" style={{ width: '100%' }}>
                      <Select.Option value="Todos">Todos</Select.Option>
                      <Select.Option value="Alta">Alta</Select.Option>
                      <Select.Option value="Media">Media</Select.Option>
                      <Select.Option value="Baja">Baja</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Estado" name="estado">
                    <Select placeholder="Todos" style={{ width: '100%' }}>
                      <Select.Option value="Todos">Todos</Select.Option>
                      <Select.Option value="Abierto">Abierto</Select.Option>
                      <Select.Option value="Cerrado">Cerrado</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Fecha Inicio" name="fecha_inicio">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Fecha Fin" name="fecha_fin">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                  Aplicar Filtros
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleExportToExcel}>
                  Exportar a Excel
                </Button>
              </div>
            </Space>
          </Form>
        </Card>
      )}

      <Table
        dataSource={tickets}
        columns={columns}
        rowKey="id_ticket"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={modalMode === 'details' ? 'Detalles del Ticket' : 'Editar Ticket'}
        visible={isModalOpen}
        onCancel={handleCloseModal}
        footer={
          modalMode === 'details' ? (
            <Button onClick={handleCloseModal}>Cerrar</Button>
          ) : (
            <Space>
              <Button onClick={handleCloseModal}>Cancelar</Button>
              <Button type="primary" onClick={handleSaveEdit}>
                Guardar cambios
              </Button>
            </Space>
          )
        }
      >
        {selectedTicket && (
          <Card title={`Ticket ID: ${selectedTicket.id_ticket}`} style={{ marginBottom: 20 }}>
            {modalMode === 'details' ? (
              <>
                <Text strong>Departamento: </Text>{selectedTicket.nombre_departamento}
                <br />
                <Text strong>Prioridad: </Text>{selectedTicket.prioridad}
                <br />
                <Text strong>Estado: </Text>{selectedTicket.estado}
                <br />
                <Text strong>Descripción: </Text>{selectedTicket.descripcion}
                <br />
                <Text strong>Fecha Creación: </Text>{moment(selectedTicket.fecha_creacion).format('DD/MM/YYYY')}
              </>
            ) : (
              <Form form={form} initialValues={selectedTicket}>
                
                <Form.Item label="Departamento" name="departamento">
                  <Select>
                    <Select.Option value="Alcantarillado">Alcantarillado</Select.Option>
                    <Select.Option value="Drenaje">Drenaje</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Prioridad" name="prioridad">
                  <Select>
                    <Select.Option value="Alta">Alta</Select.Option>
                    <Select.Option value="Media">Media</Select.Option>
                    <Select.Option value="Baja">Baja</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Estado" name="estado">
                  <Select>
                    <Select.Option value="Abierto">Abierto</Select.Option>
                    <Select.Option value="Cerrado">Cerrado</Select.Option>
                  </Select>
                </Form.Item>
              </Form>
            )}
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default Tickets;
