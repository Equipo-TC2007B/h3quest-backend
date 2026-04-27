const questService = require("../services/questService");

const getQuests = async (req, res) => {
  try {
    const quests = await questService.getAllQuests();

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
