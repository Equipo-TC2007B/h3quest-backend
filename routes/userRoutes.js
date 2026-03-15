const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Ruta: POST http://localhost:3000/api/users/register
router.post("/register", userController.createUser);

// Ruta para login: POST http://localhost:3000/api/users/login
router.post("/login", userController.loginUser);

module.exports = router;
