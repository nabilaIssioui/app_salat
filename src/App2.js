import React from "react";
import { Box, Typography, Grid, IconButton, Card, Divider } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const App = () => {
  const prayerTimes = [
    { name: "Fajr", time: "06:50", alarm: true },
    { name: "Chorouq", time: "08:23", alarm: false },
    { name: "Dohr", time: "13:28", alarm: true },
    { name: "Asr", time: "16:04", alarm: true },
    { name: "Maghrib", time: "18:25", alarm: true },
    { name: "Ichaa", time: "19:46", alarm: true },
  ];

  return (
    <Box sx={{ backgroundColor: "#1c1c1c", color: "#fff", minHeight: "100vh", paddingBottom: 2 }}>
      {/* Header Image with Title */}
      <Box
        sx={{
          backgroundImage: `url('mosqu.png')`, // Remplacez par l'image réelle
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "250px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Asr
        </Typography>
        <Typography variant="h4" sx={{ marginTop: -1 }}>
          -01:51:49
        </Typography>
        <Typography variant="h6">Casablanca</Typography>
      </Box>

      {/* Date Navigation */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", paddingY: 2 }}>
        <IconButton color="inherit">
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="subtitle1" sx={{ mx: 2 }}>
          Mardi 08 Joumada ath-thania 1446
          <br />
          10 décembre 2024
        </Typography>
        <IconButton color="inherit">
          <ArrowForwardIosIcon />
        </IconButton>
        <IconButton color="inherit" sx={{ ml: 2 }}>
          <CalendarTodayIcon />
        </IconButton>
      </Box>

      {/* Prayer Times */}
      <Card sx={{ backgroundColor: "#333", padding: 2, mx: 2 }}>
        {prayerTimes.map((prayer, index) => (
          <Box key={index}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingY: 1,
              }}
            >
              <Typography variant="h6">{prayer.name}</Typography>
              <Typography variant="h6">{prayer.time}</Typography>
              <IconButton color="inherit">
                {prayer.alarm ? <NotificationsActiveIcon /> : <NotificationsOffIcon />}
              </IconButton>
            </Box>
            {index < prayerTimes.length - 1 && <Divider sx={{ borderColor: "#555" }} />}
          </Box>
        ))}
      </Card>

      {/* Hadith of the Day */}
      <Card sx={{ backgroundColor: "#444", padding: 2, margin: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Hadith du jour
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Abû Bakrah (qu'Allah l'agrée) relate que le Prophète (sur lui la paix et le salut) a dit
          par trois fois : « Ne vous informerais-je pas des plus grands des péchés majeurs ? »
        </Typography>
      </Card>

      {/* Bottom Navigation */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#222",
          display: "flex",
          justifyContent: "space-around",
          paddingY: 1,
        }}
      >
        <Typography variant="button">Aujourd'hui</Typography>
        <Typography variant="button">Qibla</Typography>
        <Typography variant="button">Mosquées</Typography>
        <Typography variant="button">Plus</Typography>
      </Box>
    </Box>
  );
}

export default App;
