import { useEffect, useState } from 'react';
import { Modal, Button, Carousel, message } from 'antd';
import axios from 'axios';

const ViewAttachmentsModal = ({ visible, onClose, ticket }) => {
  const [archivos, setArchivos] = useState([]);

  useEffect(() => {
    if (ticket) {
      fetchArchivos(ticket.id_ticket);
    }
  }, [ticket]);

  // Función para obtener los archivos adjuntos del ticket
  const fetchArchivos = async (id_ticket) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/archivos/ticket/${id_ticket}`);
      console.log('Archivos adjuntos:', response.data);
      setArchivos(response.data);
    } catch (error) {
      console.error('Error al obtener archivos:', error);
      message.error('No se pudieron cargar los archivos adjuntos.');
    }
  };

  return (
    <Modal
      title="Archivos Adjuntos"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Cerrar
        </Button>,
      ]}
    >
      {archivos.length > 0 ? (
        <Carousel>
          {archivos.map((archivo) => (
            <div key={archivo.id_archivo}>
              <img
                src={`data:${archivo.tipo};base64,${archivo.base64}`}
                alt={archivo.nombre}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          ))}
        </Carousel>
      ) : (
        <p>No hay archivos adjuntos para este ticket.</p>
      )}
    </Modal>
  );
};

export default ViewAttachmentsModal;
