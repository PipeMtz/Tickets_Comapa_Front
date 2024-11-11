import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    abiertos: 0,
    enProgreso: 0,
    cerrados: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const response = await axios.get('http://localhost:3000/api/tickets');
      const tickets = response.data;

      setStats({
        total: tickets.length,
        abiertos: tickets.filter((t) => t.estado === 'abierto').length,
        enProgreso: tickets.filter((t) => t.estado === 'en progreso').length,
        cerrados: tickets.filter((t) => t.estado === 'cerrado').length,
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="cards">
        <div>Total Tickets: {stats.total}</div>
        <div>Tickets Abiertos: {stats.abiertos}</div>
        <div>Tickets en Progreso: {stats.enProgreso}</div>
        <div>Tickets Cerrados: {stats.cerrados}</div>
      </div>
    </div>
  );
};

export default Dashboard;
