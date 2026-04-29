const pool = require("../config/db");

const getAllQuests = async (id_usuario = null) => {
  let query;
  let values = [];

  if (id_usuario) {
    query = `
      SELECT q.id_quest, q.titulo, q.descripcion, q.tipo_quest, q.dificultad, q.puntos, q.icon, q.image,
             CASE WHEN pq.id_progreso IS NOT NULL THEN true ELSE false END AS completado
      FROM quest q
      LEFT JOIN progreso_quest pq ON q.id_quest = pq.id_quest AND pq.id_usuario = $1
      WHERE q.activa = true 
      ORDER BY q.id_quest ASC;
    `;
    values = [id_usuario];
  } else {
    query = `
      SELECT id_quest, titulo, descripcion, tipo_quest, dificultad, puntos, icon, image, 
             false AS completado 
      FROM quest 
      WHERE activa = true 
      ORDER BY id_quest ASC;
    `;
  }

  const result = await pool.query(query, values);
  return result.rows;
};

module.exports = {
  getAllQuests,
};
