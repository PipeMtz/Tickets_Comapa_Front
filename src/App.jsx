import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Tickets from './components/Tickets';
import Estadisticas from './components/Estadisticas';
import Opciones from './components/Opciones';
import Login from './components/Login';
import Register from './components/Register';
import SubirTicket from './components/SubirTicket';
import Usuarios from './components/Usuarios';
import Departamentos from './components/Departamentos';
import Roles from './components/Roles';
import SidebarUser from './components/SidebarUser';
// import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Ruta para Registro */}
        <Route path="/registro" element={<Register />} />
        {/* Ruta para Dashboard */}
        <Route
          path="/dashboard"
          element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Dashboard />
              </main>
            </div>
          }
        />

        {/* Ruta para Tickets */}
        <Route
          path="/solicitudes"
          element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Tickets />
              </main>
            </div>
          }
        />
        {/* Ruta para Usuarios */}
        <Route
          path="/usuarios"
          element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Usuarios />
              </main>
            </div>
          }
        />
        {/* Ruta para Subir Tickets */}
        <Route
          path="/subir-tickets"
          element={
            <div className="app-container">
              {/* <Sidebar /> */}
              <SidebarUser />
              <main className="main-content">
                <SubirTicket />
              </main>
            </div>
          }
        />
        {/* Sidebar usuario y su solicitudes */}
        <Route
          path="/solicitudes_usuario"
          element={
            <div className="app-container">
              {/* <Sidebar /> */}
              <SidebarUser />
              <main className="main-content">
                <Tickets />
              </main>
            </div>
          }
        />

        {/* Ruta para Estadísticas */}
        <Route
          path="/estadisticas"
          element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Estadisticas />
              </main>
            </div>
          }
        />
        {/* Ruta para Departamentos */}
        <Route
          path="/departamentos"
          element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Departamentos />
              </main>
            </div>
          }
        />
        {/* Ruta para Roles */}
        <Route
          path="/roles"
          element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Roles />
              </main>
            </div>
          }
        />

        {/* Ruta para Opciones */}
        <Route
          path="/opciones"
          element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Opciones />
              </main>
            </div>
          }
        />
        <Route
          path="/ayuda"
          element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Opciones />
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
