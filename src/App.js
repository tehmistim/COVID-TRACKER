import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map'
import './App.css';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';
import numeral from 'numeral';

function App() {
  const [countries, setCountries] =  useState([]);
  const [country, setInputCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState ({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
// STATE = How to write a variable in React

// https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

// USEEFFECT = Runs a piece of code based on a given condition

  useEffect(() => {
    // The code inside here will run ONCE when the component loads and not again
    // async -> send a request to a server, wait for it, then do something with the information
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      // using fetch is the same as using axios
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom, etc.
            value: country.countryInfo.iso2, // UK, USA, FR
          }));

          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
          //Data returned in table will come back by case data and not in alphabetical order
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    // using async ?
    const countryCode = event.target.value;
      // console.log("AYE >>>>>", countryCode);
    
    const url = countryCode === 'worldwide'
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setInputCountry(countryCode);
      // All of the data from the country response
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      // sets map to country selected from dropdown list
      setMapZoom(6);
      // zooms in on country selected from dropdown list
    });

  }; // grabs selected value from the dropdown menu and sets it to the country selected

  // console.log("COUNTRY INFO >>>>>>>", countryInfo)

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
              <Select 
              variant="outlined" 
              onChange={onCountryChange} 
              value={ country } 
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {/* having the menuItem above sets the default state to Worldwide until we select a country from the dropdown menu */}

                {/* Loop through all the countries and show a dropdown list of options */}
                {countries.map((country) => (
                <MenuItem 
                  value={country.value}>{country.name}
                </MenuItem>
              ))}
              </Select>
          </FormControl>
        </div>
        
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        
        <Map 
          casesType={ casesType }
          countries={ mapCountries }
          center={ mapCenter }
          zoom={ mapZoom }
        />

      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
