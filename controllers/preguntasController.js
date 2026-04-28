const preguntasService = require("../services/preguntasService");

const getPreguntas = async (req, res) => {
  try {
    const { id_quest, limit } = req.query;

    const preguntas = await preguntasService.getPreguntasByQuest(
        Number(id_quest),
        limit ? Number(limit) : null
    );

    res.status(200).json({
      mensaje: "Preguntas recuperados exitosamente",
      preguntas: preguntas,
    });
  } catch (error) {
    console.error("Error en getPreguntas:", error);
    res.status(500).json({ error: "Error interno al obtener las preguntas." });
  }
};

module.exports = {
  getPreguntas,
};
