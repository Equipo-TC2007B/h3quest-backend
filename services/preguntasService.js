const pool = require("../config/db");

const getPreguntasByQuest = async (id_quest) => {
  let query = `
    SELECT id_pregunta, id_quest, texto, opcion_0, opcion_1, opcion_2, indice_correcto
    FROM preguntas
    WHERE activa = true
  `;

  const values = [];

  // If id_quest is provided, filter
  if (id_quest) {
    query += " AND id_quest = $1";
    values.push(id_quest);
  }

  query += " ORDER BY id_pregunta ASC";

  const result = await pool.query(query, values);
  return result.rows;
};

module.exports = {
  getPreguntasByQuest,
};

