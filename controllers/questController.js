const jwt = require("jsonwebtoken");
const questService = require("../services/questService");
const adminService = require("../services/adminService");

const getQuests = async (req, res) => {
  try {
    let id_usuario = null;
    const authHeader = req.header("Authorization");

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

const completarQuestUsuario = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario; // Lo sacamos del Token por seguridad
    const id_quest = req.params.id;
    const { puntos_obtenidos } = req.body;

    // Usamos la misma función que actualiza puntos, revisa insignias y atrapa duplicados
    await adminService.registrarProgresoQuest(
      id_usuario,
      id_quest,
      puntos_obtenidos,
    );

    res.status(200).json({ mensaje: "Quest guardado con éxito." });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error("Error guardando quest:", error);
    res.status(500).json({ error: "Error interno al guardar progreso." });
  }
};

module.exports = {
  getQuests,
  completarQuestUsuario,
};
