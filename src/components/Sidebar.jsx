
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Implementa la función para cerrar sesión
    navigate('/');
  };

  return (
    <div className="sidebar">
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/tickets")}>Tickets</button>
      <button onClick={() => navigate("/estadisticas")}>Estadísticas</button>
      <button onClick={() => navigate("/opciones")}>Opciones</button>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default Sidebar;
