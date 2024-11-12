import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  //const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        nombre,
        email,
        contrasena,
        role: 'user',
      });
      console.log('Usuario creado:', response.data);
      setSuccessMessage('Usuario creado con éxito');
      setErrorMessage('');
      setTimeout(() => navigate('/dashboard'), 2000); // Redirige al dashboard después de 2 segundos
    } catch (error) {
      console.error('Error al registrar:', error);
      setErrorMessage('Error al crear el usuario. Inténtalo de nuevo.');
      setSuccessMessage('');
    }
  };

  const redirectToLogin = () => {
    navigate('/');
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Registrar Nuevo Usuario</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="register-input"
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="register-input"
        />
        {/* <input
          type="text"
          placeholder="Rol"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="register-input"
        /> */}
        <button type="submit" className="register-button">Registrar</button>
        <button type="button" className="back-button" onClick={redirectToLogin}>Regresar</button>
      </form>
    </div>
  );
};

export default Register;
