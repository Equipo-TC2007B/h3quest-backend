const express = require("express");
const router = express.Router();
const questController = require("../controllers/questController");

// ==========================
// RUTAS PÚBLICAS (O PRIVADAS SI REQUIEREN TOKEN)
// ==========================
// Ruta: GET /api/quests
router.get("/", questController.getQuests);

module.exports = router;
