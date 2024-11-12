import { useState } from 'react';
import axios from 'axios';

const SubirTicket = () => {
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [prioridad, setPrioridad] = useState('Media');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Obtener el token del almacenamiento local o sesión
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      if (!token) {
        console.error('Token no encontrado');
        return;
      }


      const ticketData = {
        descripcion,
        direccion,
        prioridad,
      };

      // Enviar el ticket a la API
      await axios.post('http://localhost:3000/api/tickets', ticketData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Ticket enviado con éxito');
      setDescripcion('');
      setDireccion('');
      setPrioridad('Media');
    } catch (error) {
      console.error('Error al enviar el ticket:', error);
      alert('Hubo un error al enviar el ticket');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      <h2>Subir Ticket</h2>
      <textarea
        placeholder="Descripción de la queja"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Dirección"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        required
      />
      <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} required>
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baja">Baja</option>
      </select>
      <button type="submit">Enviar Ticket</button>
    </form>
  );
};

export default SubirTicket;
