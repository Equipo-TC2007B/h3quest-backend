const preguntasService = require("../services/preguntasService");

const getPreguntas = async (req, res) => {
  try {
    const { id_quest } = req.query;

    const preguntas = await preguntasService.getPreguntasByQuest(id_quest);

    res.status(200).json({
      mensaje: "Preguntas recuperados exitosamente",
      preguntas: preguntas,
    });
  } catch (error) {
    console.error("Error en getPreguntas:", error);
    res.status(500).json({ error: "Error interno al obtener los preguntas." });
  }
};

module.exports = {
  getPreguntas,
};
