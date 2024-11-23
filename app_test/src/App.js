import React, { useState } from "react";
import "./App.css";

function App() {
  
  const prayerData = {
    Casablanca: {
      Mercredi: {
        fajr: "05:10",
        shorouk: "07:01",
        dhuhr: "12:32",
        asr: "17:09",
        maghrib: "20:00",
        isha: "21:21",
      },
      Jeudi: {
        fajr: "05:11",
        shorouk: "07:02",
        dhuhr: "12:33",
        asr: "17:10",
        maghrib: "20:01",
        isha: "21:22",
      },
      Vendredi: {
        fajr: "05:12",
        shorouk: "07:03",
        dhuhr: "12:34",
        asr: "17:11",
        maghrib: "20:02",
        isha: "21:23",
      },
    },
    Rabat: {
      Mercredi: {
        fajr: "05:15",
        shorouk: "07:05",
        dhuhr: "12:36",
        asr: "17:13",
        maghrib: "20:05",
        isha: "21:26",
      },
      Jeudi: {
        fajr: "05:16",
        shorouk: "07:06",
        dhuhr: "12:37",
        asr: "17:14",
        maghrib: "20:06",
        isha: "21:27",
      },
      Vendredi: {
        fajr: "05:17",
        shorouk: "07:07",
        dhuhr: "12:38",
        asr: "17:15",
        maghrib: "20:07",
        isha: "21:28",
      },
    },
    Fes: {
      Mercredi: {
        fajr: "05:20",
        shorouk: "07:10",
        dhuhr: "12:40",
        asr: "17:18",
        maghrib: "20:10",
        isha: "21:30",
      },
      Jeudi: {
        fajr: "05:21",
        shorouk: "07:11",
        dhuhr: "12:41",
        asr: "17:19",
        maghrib: "20:11",
        isha: "21:31",
      },
      Vendredi: {
        fajr: "05:22",
        shorouk: "07:12",
        dhuhr: "12:42",
        asr: "17:20",
        maghrib: "20:12",
        isha: "21:32",
      },
    },
    Marrakech: {
      Mercredi: {
        fajr: "05:25",
        shorouk: "07:15",
        dhuhr: "12:45",
        asr: "17:23",
        maghrib: "20:15",
        isha: "21:35",
      },
      Jeudi: {
        fajr: "05:26",
        shorouk: "07:16",
        dhuhr: "12:46",
        asr: "17:24",
        maghrib: "20:16",
        isha: "21:36",
      },
      Vendredi: {
        fajr: "05:27",
        shorouk: "07:17",
        dhuhr: "12:47",
        asr: "17:25",
        maghrib: "20:17",
        isha: "21:37",
      },
    },
  };

  const [city, setCity] = useState("Casablanca");
  const [day, setDay] = useState("Mercredi");
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [title, setTitle] = useState("fajr"); // Ajout de l'état pour le titre dynamique


  // Fonction pour changer de ville
  const handleCityChange = (direction) => {
    const cities = Object.keys(prayerData);
    const currentCityIndex = cities.indexOf(city);
    let newIndex = direction === "left" ? currentCityIndex - 1 : currentCityIndex + 1;
    if (newIndex < 0) newIndex = cities.length - 1;
    if (newIndex >= cities.length) newIndex = 0;
    const newCity = cities[newIndex];
    setCity(newCity);
    setDay(Object.keys(prayerData[newCity])[0]); // Définit le premier jour par défaut
    setSelectedPrayer(prayerData[newCity][Object.keys(prayerData[newCity])[0]].fajr); // Définit la première prière par défaut
    setTitle("fajr"); // Titre mis à jour automatiquement
  };
  
  const handleDayChange = (direction) => {
    const days = Object.keys(prayerData[city]);
    const currentDayIndex = days.indexOf(day);
    let newIndex = direction === "left" ? currentDayIndex - 1 : currentDayIndex + 1;
    if (newIndex < 0) newIndex = days.length - 1;
    if (newIndex >= days.length) newIndex = 0;
    const newDay = days[newIndex];
    setDay(newDay);
    setSelectedPrayer(prayerData[city][newDay].fajr); // Définit la première prière par défaut
    setTitle("fajr"); // Titre mis à jour automatiquement
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
        {Object.entries(prayerData[city][day]).map(([prayer, time]) => (
          <div
            key={prayer}
            className={`time-row ${selectedPrayer === time ? "selected" : ""}`} // Ajouter une classe conditionnelle
            onClick={() => handlePrayerClick(prayer)}
          >
            <span>{prayer}</span>
            <span>{time}</span>
          </div>
        ))}
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
