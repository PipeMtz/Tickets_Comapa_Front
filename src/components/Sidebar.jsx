import { Layout, Menu, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DashboardOutlined, FileTextOutlined, UserOutlined, BarChartOutlined, ApartmentOutlined, TeamOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Sider } = Layout;
const { Title, Text } = Typography;

const Sidebar = () => {
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

  return (
    <Sider width={200} style={{ height: '100vh', background: '#fff' }}>
      <div className="sidebar-header">
        <Title level={3} style={{ textAlign: 'center' }}>Comapa Quejas</Title>
        {loading ? (
          <Spin tip="Cargando..." style={{ display: 'block', textAlign: 'center', marginTop: 10 }} />
        ) : (
          <Text style={{ textAlign: 'center', display: 'block', fontSize: '12px' }}>Bienvenido, {userName || 'Usuario'}</Text>
        )}
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: 'calc(100% - 130px)', borderRight: 0 }} // Ajustamos la altura para dejar espacio para el encabezado
        onClick={({ key }) => {
          if (key === 'logout') {
            handleLogout();
          } else {
            navigate(key);
          }
        }}
        items={[
          {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
          },
          {
            key: '/solicitudes',
            icon: <FileTextOutlined />,
            label: 'Solicitudes',
          },
          {
            key: '/usuarios',
            icon: <UserOutlined />,
            label: 'Usuarios',
          },
          {
            key: '/estadisticas',
            icon: <BarChartOutlined />,
            label: 'Estadísticas',
          },
          {
            key: '/departamentos',
            icon: <ApartmentOutlined />,
            label: 'Departamentos',
          },
          {
            key: '/roles',
            icon: <TeamOutlined />,
            label: 'Roles',
          },
          {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Cerrar sesión',
          },
        ]}
      />

      <div className="sidebar-footer">
        <Menu
          mode="inline"
          style={{ position: 'absolute', bottom: 0, width: '100%', borderRight: 0 }}
          onClick={({ key }) => {
            if (key === 'logout') {
              handleLogout();
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: '/opciones',
              icon: <SettingOutlined />,
              label: 'Opciones',
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Cerrar sesión',
            },
          ]}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
