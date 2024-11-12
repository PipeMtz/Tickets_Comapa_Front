import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Tickets from './components/Tickets';
import Estadisticas from './components/Estadisticas';
import Opciones from './components/Opciones';
import Login from './components/Login';
import Register from './components/Register';

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
          path="/tickets"
          element={
            <div className="app-container">
              <Sidebar />
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
      </Routes>
    </Router>
  );
}

export default App;
