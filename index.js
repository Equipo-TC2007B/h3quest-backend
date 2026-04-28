const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const questRoutes = require("./routes/questRoutes");
const preguntasRoutes = require("./routes/preguntasRoutes");
const adminRoutes = require("./routes/adminRoutes");
const tallerRoutes = require("./routes/tallerRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/preguntas", preguntasRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/talleres", tallerRoutes);

// Ruta de prueba base
app.get("/", (req, res) => {
  res.send("API del Horno 3 Quest funcionando 🚀");
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
