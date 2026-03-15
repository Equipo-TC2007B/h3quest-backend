const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verificarToken = require("../middlewares/authMiddleware");

// Ruta: POST http://localhost:3000/api/users/register
router.post("/register", userController.createUser);

// Ruta para login: POST http://localhost:3000/api/users/login
router.post("/login", userController.loginUser);

router.get("/perfil", verificarToken, (req, res) => {
  res.status(200).json({
    mensaje: "¡Bienvenido a la zona VIP del museo!",
    datosDelGafete: req.usuario,
  });
});

module.exports = router;
