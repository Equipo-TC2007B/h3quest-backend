# Horno 3 Quest Backend (h3quest-backend)

Este repositorio contiene la API RESTful para el proyecto **Horno Quest**, la aplicación interactiva para el museo Horno 3. El backend está construido en Node.js, utiliza una base de datos PostgreSQL alojada en Google Cloud Platform (GCP) y está desplegado bajo una arquitectura Serverless utilizando Vercel.

## Tech Stack

- **Entorno de Ejecución:** Node.js
- **Framework Web:** Express.js (v5.x)
- **Base de Datos:** PostgreSQL (alojada en GCP)
- **Autenticación:** JSON Web Tokens (JWT) y encriptación de contraseñas con bcrypt
- **Despliegue (Hosting):** Vercel (Serverless Functions)
- **Gestión de Entorno:** dotenv

## 🏗️ Arquitectura del Proyecto

El proyecto sigue un patrón de arquitectura en capas (Layered Architecture) para garantizar la separación de responsabilidades, la escalabilidad y un código limpio.
```text
h3quest-backend/
├── config/         # Configuración de la base de datos (pg) y variables de entorno.
├── controllers/    # Lógica de manejo de peticiones HTTP (req, res). Delegan el trabajo a los servicios.
├── routes/         # Definición de endpoints de la API y vinculación con los controladores.
├── services/       # Reglas de negocio puras e interacciones con la base de datos (Postgres).
├── index.js        # Punto de entrada de la aplicación y configuración global de Express / Vercel.
├── package.json    # Dependencias y scripts del proyecto.
└── vercel.json     # Configuración para el despliegue Serverless en Vercel.

## Endpoints de la API

A continuación se listan las rutas principales de la aplicación, agrupadas por módulo y especificando su nivel de acceso.

> **Nota sobre autenticación:** 
> - **Privado:** Requiere enviar un header `Authorization: Bearer <tu_token>`.
> - **Admin:** Requiere un token válido y que el usuario tenga el rol `tipo_usuario === "admin"`.

### Usuarios (`/api/users`)
*   `POST /api/users/register`: Público. Crea y registra un nuevo usuario en la base de datos[cite: 6].
*   `POST /api/users/login`: Público. Autentica al usuario y devuelve el JWT[cite: 6].
*   `GET /api/users/perfil`: Privado. Obtiene el perfil completo del usuario autenticado, incluyendo su información básica, insignias obtenidas, rango ("Explorador de Acero") y conteo de misiones completadas[cite: 6].

### Quests y Progreso (`/api/quests` y rutas de admin)
*   `GET /api/quests`: Público. Obtiene la lista de misiones (quests) disponibles[cite: 4].
*   `POST /api/quests/:id/completar`: Privado. Registra que el usuario autenticado completó un quest en específico[cite: 4].
*   `POST /completar`: Privado. Guarda el progreso general de los quests del usuario[cite: 1].

### Talleres (`/api/talleres`)
*   `GET /api/talleres`: Público. Obtiene el listado de talleres[cite: 5].
*   `POST /api/talleres`: Admin. Crea un nuevo taller en el sistema[cite: 5].
*   `PUT /api/talleres/:id`: Admin. Edita el título y el horario de un taller existente[cite: 5].
*   `PUT /api/talleres/:id/toggle`: Admin. Cambia o alterna el estado de visibilidad/activación de un taller[cite: 5].
*   `DELETE /api/talleres/:id`: Admin. Elimina un taller por completo de la base de datos[cite: 5].

### Administración y Métricas (Rutas protegidas)
*   `GET /estadisticas/edades`: Admin. Devuelve las estadísticas demográficas (edades) de los usuarios registrados[cite: 1].
*   `GET /metrics`: Admin. Devuelve datos y métricas generales para la visualización de gráficas en el dashboard[cite: 1].

### Contenido Educativo
*   `GET /api/contenidoia`: Público (o Privado, según configuración de middleware). Obtiene el contenido generado o gestionado por inteligencia artificial[cite: 2].
*   `GET /api/preguntas`: Público (o Privado, según configuración de middleware). Devuelve la lista de preguntas utilizadas en las trivias y quests[cite: 3].