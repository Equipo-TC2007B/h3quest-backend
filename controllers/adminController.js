const adminService = require("../services/adminService");

// Controlador para POST /api/admin/completar
const completarQuest = async (req, res) => {
  try {
    const { id_usuario, id_quest, puntos_obtenidos } = req.body;

    if (!id_usuario || !id_quest) {
      return res
        .status(400)
        .json({ error: "Faltan datos requeridos (id_usuario, id_quest)." });
    }

    await adminService.registrarProgresoQuest(
      id_usuario,
      id_quest,
      puntos_obtenidos,
    );

    res
      .status(200)
      .json({ mensaje: "Progreso guardado y puntos actualizados con éxito." });
  } catch (error) {
    console.error("Error al completar quest:", error);
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno al actualizar progreso." });
  }
};

// Controlador para GET /api/admin/metrics
const getMetrics = async (req, res) => {
  try {
    const metrics = await adminService.getAdminMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    console.error("Error al obtener métricas:", error);
    res.status(500).json({
      error: "Error interno al obtener las estadísticas del dashboard.",
    });
  }
};

const getEstadisticasEdades = async (req, res) => {
  try {
    const estadisticas = await adminService.getDistribucionEdades();
    res.status(200).json(estadisticas);
  } catch (error) {
    console.error("Error al obtener estadísticas de edades:", error);
    res
      .status(500)
      .json({ error: "Error interno al obtener estadísticas de edades." });
  }
};

module.exports = {
  completarQuest,
  getMetrics,
  getEstadisticasEdades,
};
