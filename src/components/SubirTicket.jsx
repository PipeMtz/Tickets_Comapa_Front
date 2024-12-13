/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, message, Upload, Input, Select, Form, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../styles/SubirTicket.css';

const { TextArea } = Input;
const { Option } = Select;

  const SubirTicket = () => {
    const navigate = useNavigate();
    const [descripcion, setDescripcion] = useState('');
    const [direccion, setDireccion] = useState('');
    const [asunto, setAsunto] = useState('');
    const [archivos, setArchivos] = useState([]);
    const [tipos, setTipos] = useState([]); // Opciones de asuntos
    const [loadingTipos, setLoadingTipos] = useState(false);

  useEffect(() => {
    const fetchTipos = async () => {
      setLoadingTipos(true);
      try {
        const response = await axios.get('http://localhost:3000/api/tipos');
        setTipos(response.data);
      } catch (error) {
        message.error('Error al cargar los tipos de asuntos');
        console.error('Error al obtener tipos:', error);
      } finally {
        setLoadingTipos(false);
      }
    };

    fetchTipos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descripcion || !direccion || !asunto) {
        message.error('Por favor completa todos los campos obligatorios');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            message.error('Token no encontrado');
            return;
        }

        // Datos del ticket
        const ticketData = {
            descripcion,
            direccion,
            asunto,
        };
        console.log('Datos del ticket:', ticketData);

        // Enviar los datos del ticket
        const ticketResponse = await axios.post('http://localhost:3000/api/tickets', ticketData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Obtener todos los tickets para buscar el ID del ticket recién creado
        const ticketsResponse = await axios.get('http://localhost:3000/api/tickets', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const tickets = ticketsResponse.data;
        console.log('Tickets:', tickets);

        // Normalizar cadenas para comparación
        const normalizeString = (str) => str.trim().toLowerCase();

        let idTicket = null;

        // Usar forEach para recorrer todos los tickets y encontrar el que coincida
        tickets.forEach((ticket) => {
            if (
                normalizeString(ticket.descripcion) === normalizeString(ticketData.descripcion) &&
                normalizeString(ticket.direccion) === normalizeString(ticketData.direccion)
            ) {
                idTicket = ticket.id_ticket;
            }
        });

        if (!idTicket) {
            message.error('No se pudo encontrar el ticket recién creado');
            return;
        }

        console.log('ID del ticket encontrado:', idTicket);

        // Subir archivos si hay archivos seleccionados
        if (archivos.length > 0) {
            for (let archivo of archivos) {
                console.log('Subiendo archivo:', archivo);
                const archivoFormData = new FormData();
                archivoFormData.append('id_ticket', idTicket);
                archivoFormData.append('nombre', archivo.name);
                archivoFormData.append('tipo', archivo.type);
                archivoFormData.append('base64', archivo);

                await axios.post('http://localhost:3000/api/archivos/subir', archivoFormData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
        }

        message.success('Ticket enviado con éxito');
        setDescripcion('');
        setDireccion('');
        setAsunto('');
        setArchivos([]);

        // Mostrar modal para decidir acción siguiente
        Modal.confirm({
            title: 'Ticket enviado con éxito',
            content: '¿Desea enviar otro ticket?',
            okText: 'Sí',
            cancelText: 'No',
            onOk: () => {
                console.log('Usuario decidió enviar otro ticket');
            },
            onCancel: () => {
                navigate('/solicitudes_usuario');
            },
        });
    } catch (error) {
        console.error('Error al enviar el ticket:', error);
        message.error('Hubo un error al enviar el ticket');
    }
};

  
  

  const handleFileChange = (info) => {
    setArchivos(info.fileList.map((file) => file.originFileObj));
  };

  return (
    <Form layout="vertical" onSubmitCapture={handleSubmit} className="ticket-form">
      <h2>Enviar Solicitud</h2>

      <Form.Item label="Descripción de la queja" required>
        <TextArea
          placeholder="Escribe una breve descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
        />
      </Form.Item>

      <Form.Item label="Dirección" required>
        <Input
          placeholder="Introduce la dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Asunto" required>
        <Select
          placeholder="Selecciona un asunto"
          value={asunto}
          onChange={(value) => setAsunto(value)} // Aquí value será id_tipo
          loading={loadingTipos}
        >
          {tipos.map((tipo) => (
            <Option key={tipo.id_tipo} value={tipo.id_tipo}>
              {tipo.nombre} {/* Mostrar nombre, pero enviar id_tipo */}
            </Option>
          ))}
        </Select>
      </Form.Item>


      <Form.Item label="Adjuntar Archivos (Opcional)">
        <Upload
          multiple
          accept="image/*, .pdf, .doc, .docx, .txt, .zip, .png, .jpg, .jpeg"
          beforeUpload={() => false}
          onChange={handleFileChange}
          fileList={archivos}
          maxCount={5}
          showUploadList={{
            showRemoveIcon: true,
          }}
        >
          <Button icon={<UploadOutlined />}>Seleccionar Archivos</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Enviar Ticket
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SubirTicket;
