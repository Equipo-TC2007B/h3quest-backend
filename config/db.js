const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err, client) => {
  console.error(
    "Error inesperado en un cliente inactivo de la base de datos:",
    err.message,
  );
});

pool
  .connect()
  .then(() => console.log("✅ Conectado exitosamente a PostgreSQL en Neon"))
  .catch((err) =>
    console.error("❌ Error de conexión a la base de datos", err.stack),
  );

module.exports = pool;
