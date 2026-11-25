// Import Bootstrap CSS
import "./style.scss";
import React from "react";
import "./App.scss";
import WeatherModule from "./components/Weather_Module/WeatherModule";
function App() {
  return (
    <div className="App">
      <WeatherModule />
    </div>
  );
}

export default App;
