# Horno 3 Quest Backend (h3quest-backend)

Este repositorio contiene la API RESTful para el proyecto **Horno Quest**, la aplicación interactiva para el museo Horno 3. El backend está construido en Node.js, utiliza una base de datos PostgreSQL alojada en Google Cloud Platform (GCP) y está desplegado bajo una arquitectura Serverless utilizando Vercel.

## Tech Stack

- **Entorno de Ejecución:** Node.js
- **Framework Web:** Express.js (v5.x)
- **Base de Datos:** PostgreSQL (alojada en GCP)
- **Autenticación:** JSON Web Tokens (JWT) y encriptación de contraseñas con bcrypt
- **Despliegue (Hosting):** Vercel (Serverless Functions)
- **Gestión de Entorno:** dotenv

## Arquitectura del Proyecto

El proyecto sigue un patrón de arquitectura en capas (Layered Architecture) para garantizar la separación de responsabilidades, la escalabilidad y un código limpio.
```text
h3quest-backend/
├── config/         # Configuración de la base de datos (pg) y variables de entorno.
├── controllers/    # Lógica de manejo de peticiones HTTP (req, res). Delegan el trabajo a los servicios.
├── middlewares/    # Funciones intermedias (ej. authMiddleware) para verificar tokens y roles antes de llegar al controlador.
├── routes/         # Definición de endpoints de la API y vinculación con los middlewares y controladores.
├── services/       # Reglas de negocio puras e interacciones con la base de datos (Postgres).
├── index.js        # Punto de entrada de la aplicación y configuración global de Express / Vercel.
├── package.json    # Dependencias y scripts del proyecto.
└── vercel.json     # Configuración para el despliegue Serverless en Vercel.

## Endpoints de la API

A continuación se listan las rutas de la aplicación. 

> **Nota sobre autenticación (`middlewares/authMiddleware.js`):** 
> - **Rutas Privadas:** Requieren enviar un token JWT válido en los encabezados HTTP bajo el formato: `Authorization: Bearer <tu_token>`.
> - **Rutas Admin:** Pasan por el middleware de autenticación (para verificar que el usuario exista y el token sea válido) y posteriormente validan en la ruta que el usuario tenga el rol `tipo_usuario === "admin"`.

### Usuarios (`/api/users`)
*   `POST /api/users/register`: **Público**. Crea y registra un nuevo usuario en la base de datos.
*   `POST /api/users/login`: **Público**. Autentica al usuario y devuelve el JWT.
*   `GET /api/users/perfil`: **Privado**. Requiere token. Obtiene el perfil completo del usuario autenticado (`req.usuario.id_usuario`), incluyendo su información básica, insignias obtenidas, rango ("Explorador de Acero") y conteo de misiones completadas.

### Quests y Progreso (`/api/quests` y generales)
*   `GET /api/quests`: **Público**. Obtiene la lista de misiones (quests) disponibles.
*   `POST /api/quests/:id/completar`: **Privado**. Requiere token. Registra en el sistema que el usuario autenticado completó un quest en específico.
*   `POST /completar`: **Privado**. Requiere token. Guarda el progreso general de los quests del usuario.

### Talleres (`/api/talleres`)
*   `GET /api/talleres`: **Público**. Obtiene el listado de talleres disponibles.
*   `POST /api/talleres`: **Admin**. Crea un nuevo taller en el sistema.
*   `PUT /api/talleres/:id`: **Admin**. Edita el título y el horario de un taller existente.
*   `PUT /api/talleres/:id/toggle`: **Admin**. Cambia o alterna el estado de visibilidad/activación de un taller.
*   `DELETE /api/talleres/:id`: **Admin**. Elimina un taller de forma permanente.

### Administración y Métricas
*   `GET /estadisticas/edades`: **Admin**. Devuelve las estadísticas demográficas (edades) de los usuarios registrados para el panel de administración.
*   `GET /metrics`: **Admin**. Devuelve datos y métricas generales para las gráficas del dashboard de administración.

### Contenido Educativo
*   `GET /api/contenidoia`: **Público**. Obtiene el contenido generado o gestionado por inteligencia artificial para la app.
*   `GET /api/preguntas`: **Público**. Devuelve la lista de preguntas utilizadas en las trivias y misiones.