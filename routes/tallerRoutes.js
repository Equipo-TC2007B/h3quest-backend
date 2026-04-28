const express = require("express");
const router = express.Router();
const tallerController = require("../controllers/tallerController");
const verificarToken = require("../middlewares/authMiddleware");

// Verificación de Admin
const verificarAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.tipo_usuario === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "Exclusivo para administradores." });
  }
};

// GET público -> /api/talleres?public=true
router.get("/", tallerController.getTalleres);

// POST y PUT privados (Solo Admins)
router.post("/", verificarToken, verificarAdmin, tallerController.addTaller);
router.put("/:id", verificarToken, verificarAdmin, tallerController.editTaller);

router.put("/:id", verificarToken, verificarAdmin, tallerController.editTaller);

// DELETE privado (Solo Admins)
router.delete(
  "/:id",
  verificarToken,
  verificarAdmin,
  tallerController.removeTaller,
);

module.exports = router;
