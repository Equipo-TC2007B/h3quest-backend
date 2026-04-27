const pool = require("../config/db");

const getAllQuests = async () => {
  const query = `
    SELECT id_pregunta, id_quest, texto, opcion_0, opcion_1, opcion_2, indice_correcto
    FROM preguntas
    WHERE activa = true 
    ORDER BY id_quest ASC;
  `;

  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  getAllQuests,
};

