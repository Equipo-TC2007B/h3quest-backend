const express = require("express");
const router = express.Router();
const contenidoIAController = require("../controllers/contenidoIAController");

// ==========================
// RUTAS PÚBLICAS (O PRIVADAS SI REQUIEREN TOKEN)
// ==========================
// Ruta: GET /api/contenidoia
router.get("/", contenidoIAController.getContenidoIA);

module.exports = router;

