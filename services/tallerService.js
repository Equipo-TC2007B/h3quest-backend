const pool = require("../config/db");

// Obtener todos
const getAllTalleres = async () => {
  const query = `SELECT * FROM taller ORDER BY horario ASC;`;
  const result = await pool.query(query);
  return result.rows;
};

// Obtener solo los activos
const getTalleresActivos = async () => {
  const query = `SELECT * FROM taller WHERE activa = true ORDER BY horario ASC;`;
  const result = await pool.query(query);
  return result.rows;
};

// Crear un nuevo taller
const createTaller = async (titulo, horario) => {
  const query = `
    INSERT INTO taller (titulo, horario, activa) 
    VALUES ($1, $2, true) RETURNING *;
  `;
  const result = await pool.query(query, [titulo, horario]);
  return result.rows[0];
};

// Activar/Desactivar un taller
const toggleTallerStatus = async (id_taller, activa) => {
  const query = `
    UPDATE taller SET activa = $1 WHERE id_taller = $2 RETURNING *;
  `;
  const result = await pool.query(query, [activa, id_taller]);
  return result.rows[0];
};

// Borrar un taller
const deleteTaller = async (id_taller) => {
  const query = `DELETE FROM taller WHERE id_taller = $1 RETURNING *;`;
  const result = await pool.query(query, [id_taller]);
  return result.rows[0];
};

module.exports = {
  getAllTalleres,
  getTalleresActivos,
  createTaller,
  toggleTallerStatus,
  deleteTaller,
};
