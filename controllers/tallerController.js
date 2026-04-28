const tallerService = require("../services/tallerService");

const getTalleres = async (req, res) => {
  try {
    const isPublic = req.query.public === "true";
    const talleres = isPublic
      ? await tallerService.getTalleresActivos()
      : await tallerService.getAllTalleres();

    res.status(200).json(talleres);
  } catch (error) {
    console.error("Error en getTalleres:", error);
    res.status(500).json({ error: "Error al obtener talleres." });
  }
};

const addTaller = async (req, res) => {
  try {
    const { titulo, horario } = req.body;
    if (!titulo || !horario) {
      return res.status(400).json({ error: "Título y horario requeridos." });
    }
    const nuevo = await tallerService.createTaller(titulo, horario);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error al crear taller:", error);
    res.status(500).json({ error: "Error al crear taller." });
  }
};

const toggleTaller = async (req, res) => {
  try {
    const { id } = req.params;
    const { activa } = req.body;
    const actualizado = await tallerService.toggleTallerStatus(id, activa);
    res.status(200).json(actualizado);
  } catch (error) {
    console.error("Error al actualizar taller:", error);
    res.status(500).json({ error: "Error al actualizar taller." });
  }
};

const removeTaller = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await tallerService.deleteTaller(id);
    if (!eliminado) {
      return res.status(404).json({ error: "Taller no encontrado." });
    }
    res.status(200).json({ mensaje: "Taller eliminado con éxito." });
  } catch (error) {
    console.error("Error al eliminar taller:", error);
    res.status(500).json({ error: "Error al eliminar el taller." });
  }
};

module.exports = { getTalleres, addTaller, toggleTaller, removeTaller };
