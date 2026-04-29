const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verificarToken = require("../middlewares/authMiddleware");
const pool = require("../config/db");

// ==========================
// RUTAS PÚBLICAS
// ==========================
// Ruta: POST http://localhost:3000/api/users/register
router.post("/register", userController.createUser);

// Ruta para login: POST http://localhost:3000/api/users/login
router.post("/login", userController.loginUser);

// ==========================
// RUTAS PRIVADAS
// ==========================
router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const query = `
      SELECT id_usuario, nombre, email, tipo_usuario, 
             COALESCE(edad, date_part('year', age(dateofbirth)))::int as edad, 
             dateofbirth, fecha_registro, puntos 
      FROM usuario 
      WHERE id_usuario = $1
    `;
    const result = await pool.query(query, [req.usuario.id_usuario]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const u = result.rows[0];

    const insigniasQuery = `
      SELECT i.id_insignia, i.nombre, i.descripcion, i.icono, i.puntos_requeridos,
             CASE WHEN ui.id_insignia IS NOT NULL THEN true ELSE false END as obtenida 
      FROM insignia i
      LEFT JOIN usuario_insignia ui ON i.id_insignia = ui.id_insignia AND ui.id_usuario = $1
      ORDER BY i.puntos_requeridos ASC;
    `;
    const insigniasResult = await pool.query(insigniasQuery, [
      req.usuario.id_usuario,
    ]);

    const misionesQuery = `SELECT COUNT(*) as completadas FROM progreso_quest WHERE id_usuario = $1`;
    const misionesResult = await pool.query(misionesQuery, [
      req.usuario.id_usuario,
    ]);

    const usuarioCompleto = {
      id_usuario: u.id_usuario,
      nombre: u.nombre || "Sin Nombre",
      email: u.email,
      tipo_usuario: u.tipo_usuario || "visitante",
      edad: u.edad,
      fecha_registro: u.fecha_registro ? u.fecha_registro.toISOString() : null,
      puntosTotales: u.puntos || 0,
      misionesCompletadas: parseInt(misionesResult.rows[0].completadas) || 0,
      rango: "Explorador de Acero",
      insignias: insigniasResult.rows,
    };

    res.status(200).json({
      mensaje: "Perfil recuperado con éxito",
      usuario: usuarioCompleto,
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
