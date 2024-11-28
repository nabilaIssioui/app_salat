import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [prayerData, setPrayerData] = useState(null); // Données des prières
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [city, setCity] = useState("Casablanca"); // Ville par défaut
  const [day, setDay] = useState(new Date().toLocaleDateString("fr-FR", { weekday: "long" })); // Jour actuel
  const [selectedPrayer, setSelectedPrayer] = useState(null); // Prière sélectionnée
  const [title, setTitle] = useState("fajr"); // Titre dynamique (par défaut : Fajr)

  // Liste des villes avec leurs coordonnées GPS
  const cities = {
    Casablanca: { lat: 33.5731, long: -7.5898 },
    Rabat: { lat: 34.0209, long: -6.8417 },
    Marrakech: { lat: 31.6295, long: -7.9811 },
    Fes: { lat: 34.0331, long: -5.0003 },
  };

  useEffect(() => {
    localStorage.setItem('current_local', JSON.stringify(cities.Casablanca))


    const fetchData = async () => {
      setLoading(true); // Démarrer le chargement
      try {
        const { lat, long } = cities[city]; // Coordonnées de la ville actuelle
        const date = new Date();
        const month = date.getMonth() + 1; // Mois actuel (API utilise 1-based index)
        const year = date.getFullYear(); // Année actuelle

        // Appel API pour récupérer les horaires de prière
        const response = await axios.get(
          `http://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${long}&method=21&month=${month}&year=${year}`
        );

        const data = response.data.data;

        // Structurer les données pour un accès facile
        const formattedData = data.reduce((acc, dayData, index) => {
          const dateObj = new Date(year, month - 1, index + 1);
          const dayName = dateObj.toLocaleDateString("fr-FR", { weekday: "long" });
          acc[dayName] = dayData.timings; // Ajouter les horaires pour chaque jour
          return acc;
        }, {});

        setPrayerData({ [city]: formattedData }); // Stocker les données
        setSelectedPrayer(formattedData[day]?.Fajr || null); // Prière par défaut
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false); // Arrêter le chargement
      }
    };


    fetchData();
  }, [city]); // Recharger les données si la ville change

  // Changer de ville
  const handleCityChange = (direction) => {
    const cityNames = Object.keys(cities);
    const currentIndex = cityNames.indexOf(city);
    const newIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
    const newCity = cityNames[(newIndex + cityNames.length) % cityNames.length];
    setCity(newCity);
  };

  // Changer de jour
  const handleDayChange = (direction) => {
    const days = Object.keys(prayerData[city] || {});
    const currentIndex = days.indexOf(day);
    const newIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
    const newDay = days[(newIndex + days.length) % days.length];
    setDay(newDay);
    setSelectedPrayer(prayerData[city][newDay][title] || null);
  };

  // Sélectionner une prière
  const handlePrayerClick = (prayer) => {
    setSelectedPrayer(prayerData[city][day][prayer]);
    setTitle(prayer); // Mise à jour du titre
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">{title}</h1>
        <div className="day-selector">
          <button onClick={() => handleDayChange("left")}>←</button>
          <span>{day}</span>
          <button onClick={() => handleDayChange("right")}>→</button>
        </div>
        {selectedPrayer && <p className="time">{selectedPrayer}</p>}
      </div>

      <div className="city-selector">
        <button onClick={() => handleCityChange("left")}>←</button>
        <span>{city}</span>
        <button onClick={() => handleCityChange("right")}>→</button>
      </div>

      <div className="prayer-times">
        {loading ? (
          <p>Loading prayer times...</p>
        ) : (
          prayerData && prayerData[city] && prayerData[city][day] ? (
            Object.entries(prayerData[city][day]).map(([prayer, time]) => (
              <div
                key={prayer}
                className={`time-row ${selectedPrayer === time ? "selected" : ""}`}
                onClick={() => handlePrayerClick(prayer)}
              >
                <span>{prayer}</span>
                <span>{time}</span>
              </div>
            ))
          ) : (
            <p>No prayer times available for this city and day.</p>
          )
        )}
      </div>

      <div className="footer">
        <p>
          جميع الأوقات تعتمد على موقعك الحالي. قد تختلف بحسب المنطقة.
        </p>
      </div>
    </div>
  );
}

export default App;
