import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [prayerData, setPrayerData] = useState(null); // Données des prières
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [city, setCity] = useState("..."); // Ville obtenue par localisation
  const [day, setDay] = useState(new Date().toLocaleDateString("fr-FR", { weekday: "long" })); // Jour actuel
  const [selectedPrayer, setSelectedPrayer] = useState(null); // Prière sélectionnée
  const [title, setTitle] = useState("Fajr"); // Titre dynamique (par défaut : Fajr)

  useEffect(() => {
    const fetchPrayerTimes = async (latitude, longitude) => {
      setLoading(true);
      try {
        // Obtenez la date actuelle
        const date = new Date();
        const formattedDate = date.toISOString().split("T")[0]; // Format YYYY-MM-DD

        // Appel à l'API Aladhan pour récupérer les horaires de prière
        const response = await axios.get(
          `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=2`
        );

        const timings = response.data.data.timings;

        // Ajouter les données au state
        setPrayerData(timings);
        setSelectedPrayer(timings.Fajr); // Par défaut, afficher Fajr
      } catch (error) {
        console.error("Erreur lors de la récupération des horaires de prière :", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCityName = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=676883e20fc14b518f2e9d64620acb56`
        );
        const cityName =
          response.data.results[0].components.city ||
          response.data.results[0].components.town ||
          response.data.results[0].components.village ||
          "Inconnu";
        setCity(cityName);
      } catch (error) {
        console.error("Erreur lors de la récupération de la ville :", error);
        setCity("Inconnue");
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchPrayerTimes(latitude, longitude);
            fetchCityName(latitude, longitude);
          },
          (error) => {
            console.error("Erreur de géolocalisation :", error);
            setLoading(false);
          }
        );
      } else {
        console.error("La géolocalisation n'est pas supportée par ce navigateur.");
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  const handlePrayerClick = (prayer) => {
    setSelectedPrayer(prayerData[prayer]);
    setTitle(prayer); // Mise à jour du titre
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">{title}</h1>
        <div className="location">
          <p>📍 Ville : {city}</p>
        </div>
        <div className="day-selector">
          <span>{day}</span>
        </div>
        {selectedPrayer && <p className="time">{selectedPrayer}</p>}
      </div>

      <div className="prayer-times">
        {loading ? (
          <p>Chargement des horaires de prière...</p>
        ) : prayerData ? (
          Object.entries(prayerData).map(([prayer, time]) => (
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
          <p>Aucun horaire de prière disponible.</p>
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
