import React from "react";
import axios from "axios";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Prayers from "./prayer";

export default function MainContent() {
  const [city, setCity] = React.useState("Cairo");
  const [timings, setTimings] = React.useState(null);
  const [date, setDate] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [nextPrayer, setNextPrayer] = React.useState("");
  const [timeLeft, setTimeLeft] = React.useState("");

  // === fetch timings when city changes ===
  React.useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.aladhan.com/v1/timingsByCity?country=EG&city=${city}`)
      .then((response) => {
        const data = response.data.data;
        setTimings(data.timings);
        setDate(data.date.readable);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [city]);

  // === find next prayer and countdown ===
  React.useEffect(() => {
    if (!timings) return;

    const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const now = new Date();

    // convert prayer times to today's Date objects
    const prayerTimes = prayerOrder.map((p) => {
      const [h, m] = timings[p].split(":").map(Number);
      const t = new Date();
      t.setHours(h, m, 0, 0);
      return { name: p, time: t };
    });

    const findNextPrayer = () => {
      const current = new Date();
      let upcoming = prayerTimes.find((p) => p.time > current);

      // لو عدّى وقت العشاء، تبقى الصلاة الجاية فجر اليوم اللي بعده
      if (!upcoming) {
        const [h, m] = timings.Fajr.split(":").map(Number);
        const nextDayFajr = new Date();
        nextDayFajr.setDate(nextDayFajr.getDate() + 1);
        nextDayFajr.setHours(h, m, 0, 0);
        upcoming = { name: "Fajr", time: nextDayFajr };
      }

      setNextPrayer(upcoming.name);

      const diff = upcoming.time - current;
      if (diff <= 0) {
        setTimeLeft("دخل وقت الصلاة");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    findNextPrayer();
    const timer = setInterval(findNextPrayer, 1000);

    return () => clearInterval(timer);
  }, [timings]);

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  const prayerNamesArabic = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={6}>
          <div>
            <h2>{date || "..."}</h2>
            <h1>{city}</h1>
          </div>
        </Grid>

        <Grid size={6}>
          <div>
            <h2>
              متبقي حتى صلاة{" "}
              {nextPrayer ? prayerNamesArabic[nextPrayer] : "..."}
            </h2>
            <h1>{timeLeft || "..."}</h1>
          </div>
        </Grid>
      </Grid>

      <Divider style={{ borderColor: "white", opacity: "0.4" }} />

      {loading && (
        <p style={{ textAlign: "center", marginTop: "30px" }}>
          جاري تحميل البيانات...
        </p>
      )}

      {timings && !loading && (
        <Stack direction="row" spacing={2} style={{ marginTop: "50px" }}>
          <Prayers name="الفجر" time={timings.Fajr} image="./pics/fajr (1).jpg" />
          <Prayers name="الظهر" time={timings.Dhuhr} image="./pics/dohr.jpg" />
          <Prayers name="العصر" time={timings.Asr} image="./pics/asar.jpg" />
          <Prayers name="المغرب" time={timings.Maghrib} image="./pics/megreb.jpg" />
          <Prayers name="العشاء" time={timings.Isha} image="./pics/ashaa.jpg" />
        </Stack>
      )}

      <Stack
        direction="row"
        justifyContent="center"
        style={{ marginTop: "100px", marginBottom: "100px" }}
      >
        <FormControl
          style={{
            width: "20%",
            backgroundColor: "rgba(131, 92, 48, 0.333)",
            borderRadius: "5px",
          }}
        >
          <InputLabel id="city-select-label" style={{ color: "white" }}>
            المدينة
          </InputLabel>
          <Select
            labelId="city-select-label"
            id="city-select"
            value={city}
            label="المدينة"
            onChange={handleChange}
            style={{ color: "white" }}
          >
            <MenuItem value="Cairo">القاهرة</MenuItem>
            <MenuItem value="Giza">الجيزة</MenuItem>
            <MenuItem value="Alexandria">الإسكندرية</MenuItem>
            <MenuItem value="Sharqia">الشرقية</MenuItem>
            <MenuItem value="Aswan">أسوان</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
