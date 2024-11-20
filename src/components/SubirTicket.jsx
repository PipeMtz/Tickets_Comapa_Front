import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, message, Upload, Input, Select, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../styles/SubirTicket.css';

const { TextArea } = Input;
const { Option } = Select;

const SubirTicket = () => {
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

      // Enviar el ticket
      const response = await axios.post('http://localhost:3000/api/tickets', ticketData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const idTicket = response.data.id_ticket;

      // Subir archivos solo si hay archivos seleccionados
      if (archivos.length > 0) {
        for (let archivo of archivos) {
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
      <h2>Subir Ticket</h2>

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
