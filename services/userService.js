const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/// Registra un nuevo usuario en la base de datos y genera su token de acceso
const registerUser = async (userData) => {
  const {
    nombre,
    email,
    contrasena,
    tipo_usuario,
    edad,
    idioma_preferido,
    dateofbirth,
  } = userData;

  if (!nombre || !email || !contrasena) {
    throw {
      status: 400,
      message: "Nombre, email y contraseña son campos obligatorios.",
    };
  }

  const saltRounds = 10;
  const contrasenaHash = await bcrypt.hash(contrasena, saltRounds);

  const query = `SELECT * FROM sp_crear_usuario($1, $2, $3, $4, $5, $6, $7);`;
  const values = [
    nombre,
    email,
    contrasenaHash,
    tipo_usuario || "visitante",
    edad || null,
    idioma_preferido || null,
    dateofbirth || null,
  ];

  try {
    const result = await pool.query(query, values);
    const nuevoUsuario = result.rows[0];

    const payload = {
      id_usuario: nuevoUsuario.id_usuario,
      tipo_usuario: nuevoUsuario.tipo_usuario,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return { token, usuario: nuevoUsuario };
  } catch (error) {
    console.error("Error de BD en registerUser:", error);

    if (error.code === "23505") {
      if (
        error.constraint === "usuario_email_key" ||
        error.constraint === "usuario_email_unique"
      ) {
        throw {
          status: 409,
          message: "Este correo electrónico ya se encuentra registrado.",
        };
      } else {
        throw {
          status: 500,
          message: `Conflicto en la base de datos (Restricción: ${error.constraint}). Avisa a soporte.`,
        };
      }
    }
    throw error;
  }
};

/// Autentica a un usuario existente y devuelve su token
const authenticateUser = async (credentials) => {
  const { email, contrasena } = credentials;

  if (!email || !contrasena) {
    throw { status: 400, message: "Email y contraseña son obligatorios." };
  }

  const query = `SELECT * FROM sp_obtener_usuario_por_email($1);`;
  const result = await pool.query(query, [email]);

  if (result.rows.length === 0) {
    throw { status: 401, message: "Credenciales inválidas." };
  }

  const usuario = result.rows[0];
  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

  if (!contrasenaValida) {
    throw { status: 401, message: "Credenciales inválidas." };
  }

  const payload = {
    id_usuario: usuario.id_usuario,
    tipo_usuario: usuario.tipo_usuario,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  delete usuario.contrasena;

  return { token, usuario };
};

const getUserProfileData = async (id_usuario) => {
  try {
    const userQuery = `
      SELECT id_usuario, nombre, email, puntos_totales, edad, idioma_preferido, tipo_usuario 
      FROM usuario 
      WHERE id_usuario = $1;
    `;
    const userResult = await pool.query(userQuery, [id_usuario]);

    if (userResult.rows.length === 0) {
      throw { status: 404, message: "Usuario no encontrado." };
    }

    const usuario = userResult.rows[0];

    const badgeQuery = `
      SELECT i.nombre 
      FROM insignia_usuario iu
      JOIN insignia i ON iu.id_insignia = i.id_insignia
      WHERE iu.id_usuario = $1
      ORDER BY iu.fecha_obtencion DESC
      LIMIT 1;
    `;
    const badgeResult = await pool.query(badgeQuery, [id_usuario]);

    usuario.rango =
      badgeResult.rows.length > 0
        ? badgeResult.rows[0].nombre
        : "Aprendiz del Carbón";

    return usuario;
  } catch (error) {
    console.error("Error en getUserProfileData:", error);
    throw error;
  }
};

module.exports = {
  registerUser,
  authenticateUser,
  getUserProfileData,
};
