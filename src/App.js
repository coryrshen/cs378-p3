import { useEffect, useState } from "react";

function App() {
  const [cities, setcities] = useState({"Dallas":{"latitude":32.78306,"longitude":-96.80667},"Houston":{"latitude":29.76328,"longitude":-95.36327},"Austin":{"latitude":30.26715,"longitude":-97.74306}});
  const [citySearch, setcitySearch] = useState("");
  const [temps, setTemps] = useState([]);
  const [times, setTimes] = useState([]);
  const [selected, setselected] = useState("Dallas");

  useEffect(() => {
    getData('Dallas')
  },[]);

  const addCity = () => {
    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + citySearch)
      .then((res) => res.json())
      .then(
        (result) => {
          let tempC = citySearch;
          if (result.results || result.results !== undefined) {
            setcities({
              ...cities,
              [tempC]: {
                latitude: result.results[0].latitude,
                longitude: result.results[0].longitude,
              },
            });
          } else {
            alert("city not found");
          }
        },
        (error) => {}
      );
  };

  const getData = (city) => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=" +
        cities[city].latitude +
        "&longitude=" +
        cities[city].longitude +
        "&current_weather=true&hourly=temperature_2m"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setTemps(result.hourly.temperature_2m);
          setselected(city);
          setTimes(result.hourly.time);
        },
        (error) => {}
      );
  };

  let buttons = [];
  for (let city in cities) {
    buttons.push(
      <button
        style={{
          marginRight: "2vw",
          paddingLeft: "3vw",
          paddingRight: "3vw",
          fontSize: "5vw",
          marginTop: "2vw",
          borderRadius: "5px",
          backgroundColor: selected === city ? "lightblue" : "",
        }}
        onClick={() => {
          getData(city);
        }}
      >
        <b>{city}</b>
      </button>
    );
  }

  let info = [];
  const d = new Date();
  let hour = d.getHours();
  info.push(
    <div
      style={{
        display: "flex",
        width: "50vw",
        backgroundColor: "whtie",
        marginTop: "5vw",
        marginBottom: "2vw",
      }}
    >
      <div style={{ flex: "1", textAlign: "left", fontSize: "5vw" }}>
        <b>Time</b>{" "}
      </div>
      <div style={{ flex: "1", textAlign: "left", fontSize: "5vw" }}>
        <b>Temperature</b>
      </div>
    </div>
  );
  for (let i = hour; i < hour + 10; i++) {
    if (temps[i] !== undefined) {
      let tempTime = new Date(times[i].toString());
      let temphour = tempTime.getHours();
      info.push(
        <div
          style={{
            display: "flex",
            width: "50vw",
            backgroundColor: "white",
            paddingTop: "2vw",
          }}
        >
          <div style={{ fontSize: "5vw", flex: "1", textAlign: "left" }}>
            {temphour}
            {":00 "}
          </div>
          <div style={{ fontSize: "5vw", flex: "1", textAlign: "left" }}>
            {parseFloat((temps[i] * 1.8 + 32).toPrecision(3)) + "°F"}
          </div>
        </div>
      );
    }
  }
  return (
    <div style={{ textAlign: "center", padding: "5vh" }}>
      <div style={{ textAlign: "left" }}>{buttons}</div>
      <div style={{ paddingTop: "2vh", display: "flex" }}>
        <input
          type="text"
          style={{
            marginRight: "2vw",
            fontSize: "5vw",
            width: "50vw",
          }}
          value={citySearch}
          onChange={(e) => setcitySearch(e.target.value)}
        />
        <button
          style={{
            marginRight: "2vw",
            fontSize: "5vw",
            width: "8vw",
            height: "8vw",
            borderRadius: "8px",
          }}
          onClick={addCity}
        >
          <b>+</b>
        </button>
      </div>

      {info}
    </div>
  );
}

export default App;
