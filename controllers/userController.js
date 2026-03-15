const userService = require("../services/userService");

/// Controlador para manejar la petición HTTP de registro
const createUser = async (req, res) => {
  try {
    const { token, usuario } = await userService.registerUser(req.body);

    res.status(201).json({
      mensaje: "Usuario registrado e inicio de sesión exitoso",
      token,
      usuario,
    });
  } catch (error) {
    console.error("❌ Error en createUser:", error);
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor.";
    res.status(status).json({ error: message });
  }
};

/// Controlador para manejar la petición HTTP de login
const loginUser = async (req, res) => {
  try {
    const { token, usuario } = await userService.authenticateUser(req.body);

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario,
    });
  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor.";
    res.status(status).json({ error: message });
  }
};

module.exports = {
  createUser,
  loginUser,
};
