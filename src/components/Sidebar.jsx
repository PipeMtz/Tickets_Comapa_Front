import { Layout, Menu, Typography, Spin, Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  QuestionCircleOutlined,
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  BarChartOutlined,
  ApartmentOutlined,
  TeamOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

import '../styles/Sidebar.css';
import comapaLogo from '../assets/comapalogo.png';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState('/dashboard'); // Estado para gestionar la clave seleccionada

  const token = localStorage.getItem('token');
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id_usuario : null;

  useEffect(() => {
    const fetchUserName = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/users/${userId}`);
          const data = await response.json();
          if (response.ok) {
            setUserName(data.nombre);
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
    navigate('/');
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'ayuda') {
      setIsModalVisible(true);
    } else if (key === 'logout') {
      handleLogout();
    } else {
      setSelectedKey(key); // Actualiza la clave seleccionada
      navigate(key);
    }
  };

  const guindaColor = '#800000';

  return (
    <Sider width={200} style={{ height: '100vh', background: '#fff' }}>
      <div className="sidebar-header" style={{ backgroundColor: guindaColor, padding: '16px' }}>
        <img src={comapaLogo} alt="Comapa Logo" style={{ maxWidth: '100%', height: 'auto' }} />
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
        selectedKeys={[selectedKey]} // Vincula la selección al estado
        style={{
          height: 'calc(100% - 130px)',
          borderRight: 0,
          backgroundColor: '#fff',
        }}
        onClick={handleMenuClick}
        items={[
          {
            key: '/dashboard',
            icon: <DashboardOutlined style={{ color: guindaColor }} />,
            label: 'Menú Principal',
          },
          {
            key: '/solicitudes',
            icon: <FileTextOutlined style={{ color: guindaColor }} />,
            label: 'Solicitudes',
          },
          {
            key: '/usuarios',
            icon: <UserOutlined style={{ color: guindaColor }} />,
            label: 'Usuarios',
          },
          {
            key: '/estadisticas',
            icon: <BarChartOutlined style={{ color: guindaColor }} />,
            label: 'Estadísticas',
          },
          {
            key: '/departamentos',
            icon: <ApartmentOutlined style={{ color: guindaColor }} />,
            label: 'Departamentos',
          },
          {
            key: '/roles',
            icon: <TeamOutlined style={{ color: guindaColor }} />,
            label: 'Roles',
          },
        ]}
      />

      <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]} // Vincula la selección al estado
          style={{
            width: '100%',
            borderRight: 0,
            backgroundColor: '#fff',
          }}
          onClick={handleMenuClick}
          items={[
            {
              key: 'ayuda',
              icon: <QuestionCircleOutlined style={{ color: guindaColor }} />,
              label: 'Ayuda',
            },
            {
              key: 'logout',
              icon: <LogoutOutlined style={{ color: guindaColor }} />,
              label: 'Cerrar sesión',
            },
          ]}
        />
      </div>

      <Modal
        title="Ayuda"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Cerrar
          </Button>,
        ]}
      >
        <p>Si necesitas soporte, envía un correo a:</p>
        <p>
          <a href="mailto:felipe.mtz.s@outlook.com">felipe.mtz.s@outlook.com</a>.
        </p>
        <p>Estaremos encantados de ayudarte.</p>
      </Modal>
    </Sider>
  );
};

export default Sidebar;
