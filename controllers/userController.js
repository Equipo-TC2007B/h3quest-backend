const pool = require("../config/db");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const { nombre, email, contrasena, tipo_usuario, edad, idioma_preferido } =
      req.body;

    if (!nombre || !email || !contrasena) {
      return res.status(400).json({
        error: "Nombre, email y contraseña son campos obligatorios.",
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    const query = `SELECT * FROM sp_crear_usuario($1, $2, $3, $4, $5, $6);`;

    const values = [
      nombre,
      email,
      contrasenaHash,
      tipo_usuario || "visitante",
      edad || null,
      idioma_preferido || null,
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error en createUser:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Este correo electrónico ya se encuentra registrado.",
      });
    }

    res.status(500).json({ error: "Error interno del servidor." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios." });
    }

    const query = `SELECT * FROM sp_obtener_usuario_por_email($1);`;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const usuario = result.rows[0];

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena,
    );

    if (!contrasenaValida) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    delete usuario.contrasena;

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: usuario,
    });
  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

module.exports = {
  createUser,
  loginUser,
};
