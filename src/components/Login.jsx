import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../styles/Login.css';
import comapaLogo from '../assets/comapalogo.png';  // Asegúrate de tener el logo en la carpeta 'assets'

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    setErrorMessage('');
  
    try {
      // Iniciar sesión y obtener el token
      const response = await axios.post('http://localhost:3000/api/auth/login', values);
      const token = response.data.token;
  
      console.log('Token:', token);
      localStorage.setItem('token', token);
  
      // Decodificar el token para obtener el id_usuario
      let payload;
      try {
        payload = JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        console.error('Error al decodificar el token:', e);
        setErrorMessage('Hubo un problema con el inicio de sesión. Inténtalo de nuevo.');
        return;
      }
  
      const { id_usuario } = payload;
  
      if (!id_usuario) {
        console.error('El token no contiene un id_usuario válido.');
        setErrorMessage('No se pudo obtener el usuario. Inténtalo de nuevo.');
        return;
      }
  
      // Consultar GetUserById con el id_usuario
      const userResponse = await axios.get(`http://localhost:3000/api/users/${id_usuario}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const { id_rol } = userResponse.data;
  
      // Redirigir según el id_rol
      if (id_rol === 1 || id_rol === 2) {
        navigate('/dashboard');
      } else {
        navigate('/solicitudes_usuario');
      }
    } catch (error) {
      console.error('Error en el proceso de inicio de sesión:', error);
      setErrorMessage('Credenciales incorrectas o problema con la conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  

  const redirectToRegister = () => {
    navigate('/registro');
  };

  return (
    <div
      id='root-login'
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'white', // Fondo blanco para todo
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {/* Logo con fondo guinda */}
        <div
          style={{
            backgroundColor: '#800000', // Fondo guinda
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <img
            src={comapaLogo}
            alt="Comapa Logo"
            style={{ maxWidth: '80%', height: 'auto' }}
          />
        </div>
      </div>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Iniciar Sesión
      </Title>
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}
      <Form
        layout="vertical"
        onFinish={handleLogin}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Por favor, ingrese su email' },
            { type: 'email', message: 'El email no es válido' },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Email"
            style={{ borderRadius: '5px' }}
          />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="contrasena"
          rules={[{ required: true, message: 'Por favor, ingrese su contraseña' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Contraseña"
            style={{ borderRadius: '5px' }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              width: '100%',
              borderRadius: '5px',
              backgroundColor: '#b30000', // Color guinda más claro para el botón
              borderColor: '#b30000', // Aseguramos que el borde también sea guinda
            }}
          >
            Iniciar sesión
          </Button>
        </Form.Item>
      </Form>
      <Space style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Typography.Text>¿No tienes una cuenta?</Typography.Text>
        <Button type="link" onClick={redirectToRegister} style={{ color: 'black' }}>
          Registrarse
        </Button>
      </Space>
    </div>
  );
};

export default Login;
