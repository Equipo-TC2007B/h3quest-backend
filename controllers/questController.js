const jwt = require("jsonwebtoken");
const questService = require("../services/questService");

const getQuests = async (req, res) => {
  try {
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        id_usuario = decodificado.id_usuario;
      } catch (e) {}
    }

    const quests = await questService.getAllQuests(id_usuario);

    res.status(200).json({
      mensaje: "Quests recuperados exitosamente",
      quests: quests,
    });
  } catch (error) {
    console.error("Error en getQuests:", error);
    res.status(500).json({ error: "Error interno al obtener los quests." });
  }
};

module.exports = {
  getQuests,
};
