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