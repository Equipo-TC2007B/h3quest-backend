const pool = require("../config/db");

const getPreguntasByQuest = async (id_quest, limit) => {
  let query;
  let values;

  if (limit) {
    query = `
      SELECT *
      FROM (
        SELECT *
        FROM preguntas
        WHERE activa = true AND id_quest = $1
        ORDER BY RANDOM()
        LIMIT $2
      ) AS sub
      ORDER BY id_pregunta ASC;
    `;
    values = [id_quest, limit];
  } else {
    query = `
      SELECT *
      FROM preguntas
      WHERE activa = true AND id_quest = $1
      ORDER BY id_pregunta ASC;
    `;
    values = [id_quest];
  }

  const result = await pool.query(query, values);
  return result.rows;
};

module.exports = {
  getPreguntasByQuest,
};
