const express = require("express");
const router = express.Router();
const preguntasController = require("../controllers/preguntasController");

// ==========================
// RUTAS PÚBLICAS (O PRIVADAS SI REQUIEREN TOKEN)
// ==========================
// Ruta: GET /api/preguntas
router.get("/", preguntasController.getPreguntas);

module.exports = router;

