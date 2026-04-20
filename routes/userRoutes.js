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
    const query = "SELECT nombre, email FROM usuario WHERE id_usuario = $1";
    const result = await pool.query(query, [req.usuario.id_usuario]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({
      mensaje: "Perfil recuperado con éxito",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
