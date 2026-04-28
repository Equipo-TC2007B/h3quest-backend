const pool = require("../config/db");

const getAllContenidoIA = async () => {
  const query = `
    SELECT *
    FROM contenidos_ia
    ORDER BY id_quest ASC;
  `;

  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  getAllContenidoIA,
};
