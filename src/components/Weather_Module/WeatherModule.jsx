import { Form } from "react-bootstrap";
import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import "../Weather_Module/WeatherModule.scss";
import { Card } from "react-bootstrap";
import Location from "../Svg/Location";
import DefultWeather from "../Svg/DefultWeather";
import RotatingRectangles from "../Loading/RotatingRectangles";
import Time from "../Svg/Time";
import Windy from "../Svg/Windy";
import Sunny from "../Svg/Sunny";
import Thrmometer from "../Svg/Thrmometer";

const SearchBar = () => {
  const [citys, setCitys] = useState([]);
  const [temp, setTemp] = useState(null);
  const [name, setName] = useState(null);
  const [country, setCountry] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const SearchApiHost = "https://api.geoapify.com";
  const WeatherApiHost = "https://api.openweathermap.org";
  const SearchApiKey = process.env.REACT_APP_GEOAPIFY_KEY;
  const WeatherApiKey = process.env.REACT_APP_OPENWEATHER_KEY;
  const handelInputchange = (e) => {
    const { value } = e.currentTarget;
    fetch(`${SearchApiHost}/v1/geocode/autocomplete?text=${value}&type=city&format=json&apiKey=${SearchApiKey}`)
      .then((response) => response.json())
      .then((json) =>
        setCitys(
          json.results.map((data) => {
            const { lat, lon, city, country, formatted } = data;
            return { lat, lon, city, country, formatted };
          })
        )
      )
      .catch((error) => {
        console.error("Error fetching city data:", error);
      });
  };

  const handelSelectedCity = (e, value) => {
    if (!value || !value.lon || !value.lat) {
      console.error("Invalid value:", value);
      return;
    }

    const { lon, lat } = value;
    setLoading(true);
    setError(null);

    fetch(`${WeatherApiHost}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WeatherApiKey}`)
      .then((response) => response.json())
      .then((json) => {
        const { temp } = json.main;
        const { country, sunrise } = json.sys;
        const { name } = json;
        const { speed } = json.wind;

        setTemp(temp);
        setName(name);
        setCountry(country);
        setSunrise(sunrise);
        setSpeed(speed);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setError("An error occurred while fetching weather data.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="container">
        <Form>
          <Form.Group>
            <Autocomplete className="autocomplate" onChange={handelSelectedCity} clearOnBlur={false} options={citys} getOptionLabel={(option) => option.formatted} renderInput={(params) => <TextField onChange={handelInputchange} {...params} label={"Enter Your City....."} />} />
          </Form.Group>
        </Form>
      </div>
      {loading && (
        <div className="container text-center">
          <RotatingRectangles />
        </div>
      )}
      {!loading && !error && temp !== null && (
        <div className="container weather">
          <Card className={"text-center"}>
            <Card.Body>
              <Card.Title className="location">
                <Location /> {name} {country}
                <div className="time">
                  {" "}
                  Last Update: {new Date().toLocaleTimeString()} <Time />
                </div>
              </Card.Title>
              <div className="defultWeather">
                <DefultWeather />
              </div>
              <Card.Text className="weatherInfo">
                <div>
                  <div className="temperature">
                    {" "}
                    <Thrmometer /> {Math.floor(temp - 273.15)} ْC{" "}
                  </div>
                  <div className="m-4">Good Morning {name} </div>
                  <div className=" d-flex gap-5  info">
                    <div>
                      <div>
                        {" "}
                        Sunrise <Sunny />{" "}
                      </div>
                      <div> {sunrise && new Date(sunrise * 1000).toLocaleTimeString()} </div>
                    </div>
                    <div>
                      <div>
                        {" "}
                        Wind <Windy />
                      </div>
                      <div> {speed} m/s </div>
                    </div>
                    <div>
                      <div>
                        {" "}
                        Temperature <Thrmometer />
                      </div>
                      <div> {Math.floor(temp - 273.15)} ْ C</div>
                    </div>
                  </div>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      )}
      {error && (
        <div className="container text-center">
          <p className="text-light">{error}</p>
        </div>
      )}
    </>
  );
};

export default SearchBar;
