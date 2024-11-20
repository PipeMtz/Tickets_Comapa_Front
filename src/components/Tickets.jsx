import { useEffect, useState } from 'react';
import { Modal, Card, Table, Button, Select, DatePicker, Space, Form, Row, Col, Typography } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { FilterOutlined , SearchOutlined, DownloadOutlined, CloseOutlined, EyeOutlined} from '@ant-design/icons';


const { Text } = Typography;

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isFilterCardOpen, setIsFilterCardOpen] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async (filters = {}) => {
    try {
      const response = await axios.get('http://localhost:3000/api/tickets', { params: filters });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleExportToExcel = async () => {
    const filters = form.getFieldsValue();
    try {
      const response = await axios.get('http://localhost:3000/api/tickets/export', {
        params: filters,
        responseType: 'blob', // Para manejar archivos binarios
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
        <Button icon={<EyeOutlined />} type="link" onClick={() => showModal(record)}>
          Ver detalles
        </Button>
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

  return (
    <div className="tickets-container">
      <h2>Solicitudes</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button type="primary" 
        icon={<FilterOutlined />} 
        onClick={() => setIsFilterCardOpen(!isFilterCardOpen)}>
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
                      {/* Agrega más opciones según tus departamentos */}
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
                <Button type="primary" icon={<SearchOutlined />}  htmlType="submit">
                  Aplicar Filtros
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleExportToExcel}>Exportar a Excel</Button>
              </div>
            </Space>
          </Form>
        </Card>
      )}

      <Table
        dataSource={tickets}
        columns={columns}
        rowKey="id_ticket"
        pagination={{ pageSize: 20 }}
        bordered
      />

      <Modal
        title="Detalles del Ticket"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" icon={<CloseOutlined />}  onClick={handleCloseModal}>
            Cerrar
          </Button>,
        ]}
      >
        {selectedTicket && (
          <Card title={`Ticket ID: ${selectedTicket.id_ticket}`} bordered>
            <div style={{ marginBottom: '10px' }}>
              <Text strong>Nombre Usuario:</Text> {selectedTicket.nombre}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <Text strong>Tipo:</Text> {selectedTicket.tipo}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <Text strong>Descripción:</Text> {selectedTicket.descripcion}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <Text strong>Dirección:</Text> {selectedTicket.direccion}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <Text strong>Prioridad:</Text> {selectedTicket.prioridad}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <Text strong>Estado:</Text> {selectedTicket.estado}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <Text strong>Departamento:</Text> {selectedTicket.nombre_departamento}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <Text strong>Fecha de Creación:</Text> {moment(selectedTicket.fecha_creacion).format('DD/MM/YYYY')}
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default Tickets;
