+------------------+
|    usuarios     |
+------------------+
| id_usuario (PK)  |
| nombre           |
| email (UNIQUE)   |
| telefono         |
| contrasena       |
| id_departamento  |
| id_rol           |
| fecha_registro   |
+------------------+
        |
        | FK
        v
+---------------------+
|     usuario_roles   |
+---------------------+
| id_usuario (PK, FK) |
| id_rol (PK, FK)     |
+---------------------+

+------------------+
|      roles       |
+------------------+
| id_rol (PK)      |
| nombre_rol       |
+------------------+

+-------------------+
|      tickets     |
+-------------------+
| id_ticket (PK)    |
| id_usuario (FK)   |
| descripcion       |
| id_tipo (FK)      |
| id_usuario_asignado (FK) |
| fecha_creacion    |
| estado            |
| prioridad         |
| direccion         |
+-------------------+
        |
        | FK
        v
+--------------------------+
|  ticket_asignaciones     |
+--------------------------+
| id_asignacion (PK)       |
| id_ticket (FK)           |
| id_usuario_creador (FK)  |
| id_usuario_asignado (FK) |
| fecha_asignacion         |
+--------------------------+

+-------------------+
|   departamentos  |
+-------------------+
| id_departamento (PK) |
| nombre_departamento |
+-------------------+

+-------------------+
|      tipos        |
+-------------------+
| id_tipo (PK)      |
| nombre            |
+-------------------+

+-----------------------+
|   actualizaciones_ticket |
+-----------------------+
| id_actualizacion (PK)  |
| id_ticket (FK)         |
| id_usuario (FK)        |
| comentario             |
| fecha_actualizacion    |
+-----------------------+

+----------------------+
|      archivos        |
+----------------------+
| id_archivo (PK)      |
| id_ticket (FK)       |
| nombre               |
| tipo                 |
| base64               |
| fecha_subida         |
+----------------------+
