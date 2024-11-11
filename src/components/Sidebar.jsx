
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Implementa la función para cerrar sesión
    navigate('/');
  };

  return (
    <div className="sidebar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/tickets">Tickets</Link>
      <Link to="/estadisticas">Estadísticas</Link>
      <Link to="/opciones">Opciones</Link>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default Sidebar;
