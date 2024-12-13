import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import comapaLogo from "../assets/comapalogo.png"; // Asegúrate de tener el logo en la carpeta 'assets'

const { Title } = Typography;

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        nombre,
        email,
        contrasena,
        role: "Usuario", // Rol predeterminado
      });
      console.log("Usuario creado:", response.data);
      message.success("Usuario creado con éxito. Redirigiendo...");
      setTimeout(() => navigate("/subir-tickets"), 2000); // Redirigir después de 2 segundos
    } catch (error) {
      console.error("Error al registrar:", error);
      message.error("Error al crear el usuario. Inténtalo de nuevo.");
    }
  };

  const redirectToLogin = () => {
    navigate("/subir-tickets");
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "white", // Fondo blanco para todo
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {/* Logo con fondo guinda */}
        <div
          style={{
            backgroundColor: "#800000", // Fondo guinda
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <img
            src={comapaLogo}
            alt="Comapa Logo"
            style={{ maxWidth: "80%", height: "auto" }}
          />
        </div>
      </div>
      <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
        Registrar Nuevo Usuario
      </Title>
      <Form
        layout="vertical"
        onFinish={handleRegister}
        style={{ marginTop: "20px" }}
      >
        <Form.Item
          label="Nombre"
          rules={[{ required: true, message: "Por favor ingresa tu nombre." }]}
        >
          <Input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ borderRadius: "5px" }}
          />
        </Form.Item>

        <Form.Item
          label="Correo Electrónico"
          rules={[
            { required: true, message: "Por favor ingresa tu correo electrónico." },
            { type: "email", message: "Ingresa un correo electrónico válido." },
          ]}
        >
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ borderRadius: "5px" }}
          />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          rules={[
            { required: true, message: "Por favor ingresa tu contraseña." },
            { min: 6, message: "La contraseña debe tener al menos 6 caracteres." },
          ]}
        >
          <Input.Password
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            style={{ borderRadius: "5px" }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              backgroundColor: "#b30000", // Color guinda más claro para el botón
              borderColor: "#b30000", // Aseguramos que el borde también sea guinda
              borderRadius: "5px",
            }}
          >
            Registrar
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={redirectToLogin} block>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
