import { useEffect, useState } from 'react';
import axios from 'axios';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const response = await axios.get('http://localhost:3000/api/tickets');
      setTickets(response.data);
    };

    fetchTickets();
  }, []);

  return (
    <div>
      <h2>Tickets</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Descripción</th>
            <th>Dirección</th>
            <th>Prioridad</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.id_usuario}</td>
              <td>{ticket.descripcion}</td>
              <td>{ticket.direccion}</td>
              <td>{ticket.prioridad}</td>
              <td>{ticket.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tickets;
