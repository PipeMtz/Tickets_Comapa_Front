/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Select, Space, Button, message } from 'antd';
import axios from 'axios';

const EditTicketModal = ({ visible, onClose, onSave, ticket }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);

  // Obtener usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        message.error('Error al cargar la lista de usuarios.');
      }
    };

    fetchUsers();
  }, []);

  // Cargar datos del ticket en el formulario
  useEffect(() => {
    if (ticket) {
      form.setFieldsValue({
        ...ticket,
        id_usuario_asignado: ticket.id_usuario_asignado || null,
        prioridad: ticket.prioridad || null,
        estado: ticket.estado || null,
      });
    } else {
      form.resetFields();
    }
  }, [ticket, form]);

  const handleSave = async () => {
    try {
      const updatedData = await form.validateFields(); // Validar formulario
      const token = localStorage.getItem('token');

      console.log('Datos actualizados:', updatedData);
      console.log(ticket.id_ticket);
      // Actualizar información del ticket
      await axios.put(
        `http://localhost:3000/api/tickets/${ticket.id_ticket}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success('Ticket actualizado correctamente.');
      //onSave(updatedData); // Actualizar en el componente padre
    } catch (error) {
      console.error('Error al guardar:', error);
      message.error('Error al guardar los cambios.');
    }
  };

  return (
    <Modal
      title="Editar Ticket"
      visible={visible}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" onClick={handleSave}>
            Guardar cambios
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        {/* Prioridad */}
        <Form.Item
          label="Prioridad"
          name="prioridad"
          rules={[{ required: true, message: 'La prioridad es obligatoria' }]}
        >
          <Select placeholder="Selecciona una prioridad">
            <Select.Option value="Alta">Alta</Select.Option>
            <Select.Option value="Media">Media</Select.Option>
            <Select.Option value="Baja">Baja</Select.Option>
          </Select>
        </Form.Item>

        {/* Estado */}
        <Form.Item
          label="Estado"
          name="estado"
          rules={[{ required: true, message: 'El estado es obligatorio' }]}
        >
          <Select placeholder="Selecciona un estado">
            <Select.Option value="Abierto">Abierto</Select.Option>
            <Select.Option value="Cerrado">Cerrado</Select.Option>
            <Select.Option value="En Proceso">En Proceso</Select.Option>
            <Select.Option value="Resuelto">Resuelto</Select.Option>
          </Select>
        </Form.Item>

        {/* Asignado a */}
        <Form.Item
          label="Asignado a"
          name="id_usuario_asignado"
          rules={[{ required: true, message: 'Debes asignar un usuario' }]}
        >
          <Select
            placeholder="Selecciona un usuario"
            optionFilterProp="children"
            showSearch
            allowClear
          >
            {users.length > 0 ? (
              users.map((user) => (
                <Select.Option key={user.id_usuario} value={user.id_usuario}>
                  {user.nombre || 'Usuario desconocido'}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled>Seleccione un usuario.</Select.Option>
            )}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

EditTicketModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  ticket: PropTypes.object,
};

export default EditTicketModal;
