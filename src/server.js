const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Permet les appels de votre frontend

const API_BASE_URL = "http://api.aladhan.com/v1/calendar";

app.get("/api/getPrayers", async (req, res) => {
  try {
    const { latitude, longitude, method, month, year } = req.query;

    const response = await axios.get(API_BASE_URL, {
      params: {
        latitude,
        longitude,
        method: method || 21,
        month: month || new Date().getMonth() + 1,
        year: year || new Date().getFullYear(),
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données de l'API Adhan :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données" });
  }
});

const PORT = 8000; // Vous pouvez choisir un autre port
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur le port ${PORT}`);
});
