const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verificarToken = require("../middlewares/authMiddleware");

const verificarAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.tipo_usuario === "admin") {
    next(); // Pásale, eres admin
  } else {
    return res
      .status(403)
      .json({ error: "Acceso denegado. Exclusivo para administradores." });
  }
};

// ==========================
// RUTAS DE ADMINISTRACIÓN Y PROGRESO
// ==========================

// Guardar progreso de quests
router.post("/completar", verificarToken, adminController.completarQuest);

// Ver gráficas y métricas (SOLO administradores)
router.get(
  "/metrics",
  verificarToken,
  verificarAdmin,
  adminController.getMetrics,
);

module.exports = router;
