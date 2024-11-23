import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../styles/Login.css';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', values);
      const token = response.data.token;
      console.log('Token:', token);
      localStorage.setItem('token', token);

      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage('Credenciales incorrectas. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const redirectToRegister = () => {
    navigate('/registro');
  };

  return (
    <div id='root-login' style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
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
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            Iniciar sesión
          </Button>
        </Form.Item>
      </Form>
      <Space style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Typography.Text>¿No tienes una cuenta?</Typography.Text>
        <Button type="link" onClick={redirectToRegister}>
          Registrarse
        </Button>
      </Space>
    </div>
  );
};

export default Login;
