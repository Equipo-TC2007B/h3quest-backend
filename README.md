# h3quest-backend

Este repositorio contiene la API backend para la autenticación de usuarios y conexión a la base de datos PostgreSQL. A continuación tienes todo lo que necesitas saber sobre los archivos principales, cómo se conecta a la BD, los endpoints disponibles y ejemplos para probar la API.

## Estructura relevante

- `index.js`
	- Punto de entrada de la aplicación Express.
	- Registra middlewares globales (`cors`, `express.json`) y monta las rutas en `/api/users`.
	- Lee `PORT` desde `.env` (o usa 3000 por defecto).

- `config/db.js`
	- Configura y exporta un `Pool` de `pg` (PostgreSQL) usando `process.env.DATABASE_URL`.
	- Hace `pool.connect()` al importar el módulo y registra mensajes de éxito/fallo.
	- Exporta `pool` para usar `pool.query()` en el resto del proyecto.

- `routes/userRoutes.js`
	- Define las rutas relacionadas con usuarios y las monta en `/api/users`:
		- `POST /api/users/register` → registra un usuario
		- `POST /api/users/login` → autentica (login)
		- `GET /api/users/perfil` → ruta protegida que usa `verificarToken` middleware

- `controllers/userController.js`
	- `createUser(req, res)` → usa `userService.registerUser` y responde con `token` y `usuario`.
	- `loginUser(req, res)` → usa `userService.authenticateUser` y responde con `token` y `usuario`.

- `services/userService.js`
	- `registerUser(userData)`
		- Valida campos mínimos (`nombre`, `email`, `contrasena`).
		- Hashea la contraseña con `bcrypt` (saltRounds = 10).
		- Llama al procedimiento almacenado `sp_crear_usuario(...)` con los valores (nombre, email, contrasenaHash, tipo_usuario, edad, idioma_preferido).
		- Devuelve un `token` JWT firmado con `process.env.JWT_SECRET` (expira en 7 días) y el `usuario` creado.
		- Maneja error `23505` (violación de unicidad) y lanza un error 409 si el email ya existe.
	- `authenticateUser(credentials)`
		- Valida que existan `email` y `contrasena`.
		- Llama al procedimiento almacenado `sp_obtener_usuario_por_email($1)`.
		- Compara la contraseña con `bcrypt.compare`.
		- Si ok, genera un JWT con `id_usuario` y `tipo_usuario`.
		- Quita `contrasena` del objeto usuario antes de devolverlo.

- `middlewares/authMiddleware.js`
	- `verificarToken(req, res, next)`:
		- Espera header `Authorization: Bearer <token>`.
		- Verifica el token con `jwt.verify(token, process.env.JWT_SECRET)`.
		- Adjunta `req.usuario` con el payload decodificado y llama `next()`.
		- Si el token falta o es inválido responde 401.

## Variables de entorno necesarias

Crea un archivo `.env` en la raíz con (ejemplo):

DATABASE_URL=postgres://user:password@host:port/dbname
JWT_SECRET=una_clave_secreta_larga
PORT=3000

Notas:
- `DATABASE_URL` es usada por `config/db.js` para crear el `Pool` de `pg`.
- `JWT_SECRET` es necesaria para firmar/verificar tokens JWT.
- `PORT` es opcional; default = 3000.

## Procedimientos almacenados (en la BD)

El servicio espera los siguientes procedimientos almacenados en PostgreSQL:

- `sp_crear_usuario(nombre text, email text, contrasena text, tipo_usuario text, edad int, idioma_preferido text)`
	- Debe insertar el usuario y devolver la fila del nuevo usuario (con `id_usuario`, `tipo_usuario`, etc.).
	- Debe lanzar error de unicidad si el email ya existe (para que el código capture `error.code === '23505'`).

- `sp_obtener_usuario_por_email(email text)`
	- Debe devolver la fila del usuario correspondiente, incluyendo la columna `contrasena` (hash) para comparar.

Si no tienes estos stored procedures, o prefieres queries directos, puedes cambiar `userService.js` para ejecutar `INSERT` o `SELECT` desde el propio código.

## Endpoints (resumen y ejemplos)

Base URL local: http://localhost:3000
Rutas montadas en `/api/users`.

1) Registrar usuario
- Método: POST
- URL: `/api/users/register`
- Body JSON esperado (ejemplo):
	{
		"nombre": "Juan",
		"email": "juan@ejemplo.com",
		"contrasena": "secreto123",
		"tipo_usuario": "visitante", // opcional
		"edad": 30, // opcional
		"idioma_preferido": "es" // opcional
	}
- Respuesta exitosa: 201 con `{ mensaje, token, usuario }`.

Ejemplo curl:

curl -X POST http://localhost:3000/api/users/register \
	-H "Content-Type: application/json" \
	-d '{"nombre":"Juan","email":"juan@ejemplo.com","contrasena":"secreto123"}'

2) Login (autenticación)
- Método: POST
- URL: `/api/users/login`
- Body JSON: `{ "email": "juan@ejemplo.com", "contrasena": "secreto123" }`
- Respuesta: 200 con `{ mensaje, token, usuario }`.

Ejemplo curl:

curl -X POST http://localhost:3000/api/users/login \
	-H "Content-Type: application/json" \
	-d '{"email":"juan@ejemplo.com","contrasena":"secreto123"}'

3) Perfil (ruta protegida)
- Método: GET
- URL: `/api/users/perfil`
- Header: `Authorization: Bearer <token>` (token obtenido en register/login)
- Respuesta: 200 con mensaje y `datosDelGafete: req.usuario`.

Ejemplo curl (con token):

curl -X GET http://localhost:3000/api/users/perfil \
	-H "Authorization: Bearer eyJhbGciOi..."

## Cómo ejecutar el proyecto

1. Instala dependencias:

```bash
npm install
```

2. Crea un `.env` con `DATABASE_URL` y `JWT_SECRET`.

3. Inicia en modo desarrollo (con nodemon):

```bash
npm run dev
```

4. Prueba los endpoints con `curl` o Postman.

## Notas de seguridad y producción

- Nunca comites tu `.env` ni expongas `JWT_SECRET` o credenciales de la BD.
- Asegúrate de que `DATABASE_URL` use SSL y credenciales seguras en producción.
- Usa variables de entorno gestionadas por el proveedor (Heroku, Neon, Vercel, etc.) en vez de archivar `.env`.

## Posibles problemas y soluciones rápidas

- Error: `process.env.JWT_SECRET` undefined
	- Asegúrate de crear `.env` y reiniciar el servidor.

- Error de conexión a BD
	- Revisa que `DATABASE_URL` sea correcto y accesible desde tu red.
	- Verifica que la base de datos tenga los procedimientos almacenados necesarios.

- El servidor se cae al requerir `config/db.js`
	- `config/db.js` ejecuta `pool.connect()` al importar; si quieres evitar que la app falle al importar cuando la DB no está disponible, puedes remover la llamada `pool.connect()` y dejar que `pool.query()` maneje la conexión bajo demanda.

## Sugerencias y próximos pasos

- Añadir validaciones con una librería (ej. `joi` o `express-validator`) para las solicitudes de registro/login.
- Añadir tests unitarios para `userService` y tests de integración para las rutas.
- Implementar refresh tokens si necesitas sesiones más largas o revocables.
- Añadir logging estructurado y manejo de errores centralizado (middleware de errores).

---

Si quieres que añada también ejemplos Postman o que modifique el código para usar queries en lugar de stored procedures, dime y lo implemento.
