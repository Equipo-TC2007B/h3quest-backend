const pool = require("../config/db");

const getAllQuests = async () => {
  const query = `
    SELECT id_quest, titulo, descripcion, tipo_quest, dificultad, puntos, icon, image
    FROM quest 
    WHERE activa = true 
    ORDER BY id_quest ASC;
  `;

  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  getAllQuests,
};
