const pool = require("../config/db");

// ==========================================
// LÓGICA PARA /completar (Usado por Visitantes)
// ==========================================
const registrarProgresoQuest = async (
  id_usuario,
  id_quest,
  puntos_obtenidos,
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE usuario SET puntos = COALESCE(puntos, 0) + $1 WHERE id_usuario = $2`,
      [puntos_obtenidos, id_usuario],
    );

    await client.query(
      `INSERT INTO progreso_quest (id_usuario, id_quest, fecha_completado, puntos_obtenidos) 
       VALUES ($1, $2, CURRENT_TIMESTAMP, $3)`,
      [id_usuario, id_quest, puntos_obtenidos],
    );

    await client.query(
      `INSERT INTO usuario_insignia (id_usuario, id_insignia, fecha_obtenida)
       SELECT $1, id_insignia, CURRENT_TIMESTAMP
       FROM insignia
       WHERE puntos_requeridos <= (SELECT puntos FROM usuario WHERE id_usuario = $1)
       ON CONFLICT (id_usuario, id_insignia) DO NOTHING;`,
      [id_usuario],
    );

    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ==========================================
// LÓGICA PARA /metrics (Usado por Admins)
// ==========================================
const getAdminMetrics = async () => {
  const traficoQuery = `
    SELECT q.titulo as zona, COUNT(p.id_progreso) as visitas 
    FROM progreso_quest p 
    JOIN quest q ON p.id_quest = q.id_quest 
    GROUP BY q.titulo 
    ORDER BY visitas DESC;
  `;

  const edadesQuery = `
    SELECT edad, COUNT(*) as cantidad 
    FROM usuario 
    WHERE edad IS NOT NULL 
    GROUP BY edad 
    ORDER BY edad;
  `;

  const talleresQuery = `SELECT * FROM taller ORDER BY id_taller;`;

  const [trafico, edades, talleres] = await Promise.all([
    pool.query(traficoQuery),
    pool.query(edadesQuery),
    pool.query(talleresQuery),
  ]);

  return {
    trafico: trafico.rows,
    edades: edades.rows,
    talleres: talleres.rows,
  };
};

module.exports = {
  registrarProgresoQuest,
  getAdminMetrics,
};
