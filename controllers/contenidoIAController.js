const contenidoIAService = require("../services/contenidoIAService");

const getContenidoIA = async (req, res) => {
  try {

    /*
    const contenidoIA = await contenidoIAService.getContenidoIAByQuest(
        Number(id_quest)
    );
    */

    const contenidoIA = await contenidoIAService.getAllContenidoIA();

    res.status(200).json({
      mensaje: "Contenido IA recuperado exitosamente",
      contenidoIA: contenidoIA,
    });
  } catch (error) {
    console.error("Error en getContenidoIA:", error);
    res.status(500).json({ error: "Error interno al obtener el contenidoIA." });
  }
};

module.exports = {
  getContenidoIA,
};
