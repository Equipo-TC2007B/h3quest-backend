const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error:
        "Acceso denegado. No se proporcionó un token de autenticación válido.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payloadDecodificado = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = payloadDecodificado;

    next();
  } catch (error) {
    console.error("❌ Token inválido o expirado:", error.message);
    return res
      .status(401)
      .json({
        error:
          "Token inválido o expirado. Por favor, inicia sesión nuevamente.",
      });
  }
};

module.exports = verificarToken;
