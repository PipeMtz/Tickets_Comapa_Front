/* eslint-disable no-unused-vars */
import { Layout, Menu, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DashboardOutlined, FileTextOutlined, UserOutlined, BarChartOutlined, ApartmentOutlined, TeamOutlined, SettingOutlined, LogoutOutlined, UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import '../styles/Sidebar.css';
import comapaLogo from '../assets/comapalogo.png';

const { Sider } = Layout;
const { Title, Text } = Typography;

const SidebarUser = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Obtener el id_usuario desde el token o del localStorage
  const token = localStorage.getItem('token');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id_usuario : null; // Si el token contiene id_usuario

  useEffect(() => {
    const fetchUserName = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/users/${userId}`);
          const data = await response.json();
          if (response.ok) {
            setUserName(data.nombre); // Asignar el nombre del usuario
          } else {
            console.error('No se encontró el usuario');
          }
        } catch (error) {
          console.error('Error al obtener el usuario:', error);
        }
      }
      setLoading(false);
    };

    fetchUserName();
  }, [userId]);

  const handleLogout = () => {
    // Implementa la función para cerrar sesión
    navigate('/');
  };

  const guindaColor = '#800000'; // Define el color guinda

  return (
    <Sider width={200} style={{ height: '100vh', background: '#fff' }}>
      <div className="sidebar-header" style={{ backgroundColor: guindaColor, padding: '16px' }}>
        <img 
          src={comapaLogo} 
          alt="Comapa Logo" 
          style={{ maxWidth: '100%', height: 'auto' }} 
        />
        {loading ? (
          <Spin tip="Cargando..." style={{ display: 'block', textAlign: 'center', marginTop: 10 }} />
        ) : (
          <Text style={{ textAlign: 'center', display: 'block', fontSize: '12px', color: 'white' }}>
            Bienvenido, {userName || 'Usuario'}
          </Text>
        )}
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{
          height: 'calc(100% - 130px)', 
          borderRight: 0,
          backgroundColor: '#fff', // Fondo blanco para el menú
        }} 
        onClick={({ key }) => {
          if (key === 'logout') {
            handleLogout();
          } else {
            navigate(key);
          }
        }}
        items={[
          {
            key: '/solicitudes_usuario',
            icon: <FileTextOutlined style={{ color: guindaColor }} />,
            label: 'Solicitudes',
          },
          {
            key: '/subir-tickets',
            icon: <UploadOutlined style={{ color: guindaColor }} />,
            label: 'Subir Tickets',
          }
        ]}
      />

      <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
        <Menu
          mode="inline"
          style={{
            width: '100%', 
            borderRight: 0, 
            backgroundColor: '#fff', // Fondo blanco para el pie de página
          }}
          onClick={({ key }) => {
            if (key === 'logout') {
              handleLogout();
            } else {
              navigate(key);
            }
          }}
          items={[
            // {
            //   key: '/opciones',
            //   icon: <SettingOutlined style={{ color: guindaColor }} />,
            //   label: 'Opciones',
            // },
            {
              key: 'logout',
              icon: <LogoutOutlined style={{ color: guindaColor }} />,
              label: 'Cerrar sesión',
            },
          ]}
        />
      </div>
    </Sider>
  );
};

export default SidebarUser;
