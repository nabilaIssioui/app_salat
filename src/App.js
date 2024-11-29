import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { FaMapMarkerAlt } from "react-icons/fa";

const App = () => {
  const [prayerData, setPrayerData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [city, setCity] = useState("..."); 
  const [date, setDate] = useState(new Date()); 
  const [currentPrayer, setCurrentPrayer] = useState("Fajr"); 
  const [title, setTitle] = useState("Fajr"); 
  const locationData = JSON.parse(localStorage.getItem('locationData'));

    //utiliser lapi directement dans sécutité


  /* const fetchPrayerTimes = async (latitude, longitude, currentDate) => {
    setLoading(true);
    try {
      const formattedDate = currentDate.toISOString().split("T")[0]; // Formater la date en YYYY-MM-DD
      const response = await axios.get(
        `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      setPrayerData(response.data.data.timings);
      setTitle(currentPrayer);
    } catch (error) {
      console.error("Erreur lors de la récupération des horaires de prière :", error);
    } finally {
      setLoading(false);
    }
  }; */

  //utiliser lapi avec sécurité pour n'a pas apparait sur la partie network de devtols

  const fetchPrayerTimes = async (latitude, longitude, currentDate) => {
    setLoading(true);
    try {
      const formattedDate = currentDate.toISOString().split("T")[0]; // Formater la date en YYYY-MM-DD
      const response = await axios.get(
        `http://127.0.0.1:8000/api/prayer-times?latitude=${latitude}&longitude=${longitude}&date=${formattedDate}`
      );
      setPrayerData(response.data.data.timings);
      setTitle(currentPrayer);
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
      const cityName = response.data.results[0].components.city ||
                       response.data.results[0].components.town ||
                       response.data.results[0].components.village || 
                       "Inconnu";
      setCity(cityName);
      const locationData = { cityName, latitude, longitude };
      localStorage.setItem('locationData', JSON.stringify(locationData));
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
          const locData = locationData || { latitude, longitude };
          fetchPrayerTimes(locData.latitude, locData.longitude, date); // Utiliser la date dynamique
          fetchCityName(locData.latitude, locData.longitude);
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
  

  useEffect(() => {

    

    getLocation();
  }, [date, currentPrayer]);

  const handlePrayerClick = (prayer) => {
    setCurrentPrayer(prayer);
    setTitle(prayer);
  };

  const handlePreviousDay = () => {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    setDate(previousDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    setDate(nextDay);
  };

  

  const formattedDate = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const selectedPrayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">{title}</h1>
        <div className="location">
          <p>
            📍 {city}
            <FaMapMarkerAlt
              className="location-icon"
              onClick={getLocation}
              style={{ cursor: "pointer", marginLeft: "15px", color: "red" }}
              title="Relocaliser"
            />
          </p>
        </div>
        <div className="day-selector">
          <button className="arrow-button" onClick={handlePreviousDay}>◀</button>
          <span>{formattedDate}</span>
          <button className="arrow-button" onClick={handleNextDay}>▶</button>
        </div>
        {prayerData && currentPrayer && (
          <p className="time">{prayerData[currentPrayer]}</p>
        )}
      </div>

      <div className="prayer-times">
        {loading ? (
          <p>Chargement des horaires de prière...</p>
        ) : prayerData ? (
          <div className="prayer-row">
            {Object.entries(prayerData)
              .filter(([prayer]) => selectedPrayers.includes(prayer))
              .map(([prayer, time]) => (
                <div
                  key={prayer}
                  className={`time-row ${currentPrayer === prayer ? "selected" : ""}`}
                  onClick={() => handlePrayerClick(prayer)}
                >
                  <span>{prayer}</span>
                  <span>{time}</span>
                </div>
              ))}
          </div>
        ) : (
          <p>Aucun horaire de prière disponible.</p>
        )}
      </div>

      <div class="hadith">
      <h2>Hadith du jour</h2>
      <div class="content">
        <p>Abû Bakrah (qu'Allah l'agrée) relate que le Prophète (sur lui la paix et salut) a dit par trois fois : « Ne vous informerais-je pas des plus grands des péchés majeurs ? » Nous dîmes : « Mais si ! Ô Messager d'Allah ! » Alors, il mentionna : « L'association à Allah, la désobéissance aux parents et le faux témoignage. »</p>
        <footer>— Rapporté par Abi Bakrah (qu'Allah l'agrée)</footer>
      </div>
    </div>

    </div>
  );
}

export default App;
