import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  
  const [prayerData, setPrayerData] = useState(null); // Initially null
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getPrayers`);
        setPrayerData(response.data); // Populate the prayer data
        console.log  (response.data)      
        setLoading(false); // Stop loading after data is fetched
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setLoading(false); // Stop loading even if there is an error
      }
    };

    fetchData();
  }, []);

  

  const [city, setCity] = useState("Casablanca");
  const [day, setDay] = useState("Mercredi");
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [title, setTitle] = useState("fajr"); // Ajout de l'état pour le titre dynamique


  // Fonction pour changer de ville
  // Fonction pour changer de ville
const handleCityChange = (direction) => {
  const cities = Object.keys(prayerData);
  const currentCityIndex = cities.indexOf(city);
  let newIndex = direction === "left" ? currentCityIndex - 1 : currentCityIndex + 1;
  if (newIndex < 0) newIndex = cities.length - 1;
  if (newIndex >= cities.length) newIndex = 0;
  const newCity = cities[newIndex];
  
  setCity(newCity);

  // Préserver la prière sélectionnée ou passer à une par défaut si elle n'existe pas
  const newDay = Object.keys(prayerData[newCity])[0]; // Le premier jour par défaut
  const newPrayer = prayerData[newCity][newDay][title] || prayerData[newCity][newDay].fajr; // Vérifie si la prière actuelle existe
  setDay(newDay);
  setSelectedPrayer(newPrayer);
};

// Fonction pour changer de jour
const handleDayChange = (direction) => {
  const days = Object.keys(prayerData[city]);
  const currentDayIndex = days.indexOf(day);
  let newIndex = direction === "left" ? currentDayIndex - 1 : currentDayIndex + 1;
  if (newIndex < 0) newIndex = days.length - 1;
  if (newIndex >= days.length) newIndex = 0;
  const newDay = days[newIndex];
  
  setDay(newDay);

  // Préserver la prière sélectionnée ou passer à une par défaut si elle n'existe pas
  const newPrayer = prayerData[city][newDay][title] || prayerData[city][newDay].fajr; // Vérifie si la prière actuelle existe
  setSelectedPrayer(newPrayer);
};



  // Fonction pour afficher l'heure de prière et mettre à jour le titre
  const handlePrayerClick = (prayer) => {
    setSelectedPrayer(prayerData[city][day][prayer]);
    setTitle(prayer); // Mise à jour du titre avec le nom de la prière
  };

  return (
    <div className="container">
      {/* Partie glissable pour les jours */}
      <div className="header">
        <h1 className="title">{title}</h1> {/* Titre dynamique */}
        <div className="day-selector">
          <button onClick={() => handleDayChange("left")}>←</button>
          <span>{day}</span>
          <button onClick={() => handleDayChange("right")}>→</button>
        </div>
        {selectedPrayer && <p className="time">{selectedPrayer}</p>}
      </div>

      {/* Partie centrale pour la sélection de la ville */}
      <div className="city-selector">
        <button onClick={() => handleCityChange("left")}>←</button>
        <span>{city}</span>
        <button onClick={() => handleCityChange("right")}>→</button>
      </div>

      {/* Partie des horaires de prière */}
      

      <div className="prayer-times">
        {loading ? (  // Display loading while data is being fetched
          <p>Loading prayer times...</p>
        ) : (
          prayerData && prayerData[city] && prayerData[city][day] ? (
            Object.entries(prayerData[city][day]).map(([prayer, time]) => (
              <div
                key={prayer}
                className={`time-row ${selectedPrayer === time ? "selected" : ""}`} // Ajouter une classe conditionnelle
                onClick={() => handlePrayerClick(prayer)}
              >
                <span>{prayer}</span>
                <span>{time}</span>
              </div>
            ))
          ) : (
            <p>No prayer times available for this city and day.</p>  // Handle empty data
          )
        )}
      </div>


      {/* Partie inférieure */}
      <div className="footer">
        <p>
          جميع الأوقات تعتمد على موقعك الحالي. قد تختلف بحسب المنطقة.
        </p>
      </div>
    </div>
  );
}

export default App;
