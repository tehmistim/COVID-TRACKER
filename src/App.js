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
import { sortData } from './util';
import LineGraph from './LineGraph';



function App() {
  const [countries, setCountries] =  useState([]);
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([]);
// STATE = How to write a variable in React

// https://disease.sh/v3/covid-19/countries

  useEffect (() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
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
        const countries = data.map((country) => (
          {
            name: country.country, // United States, United Kingdom, etc.
            value: country.countryInfo.iso2 // UK, USA, FR
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          //Data returned in table will come back by case data and not in alphabetical order
          setCountries(countries);
      });
    };

    getCountriesData();

  }, []);

  const onCountryChange = async (event) => {
    // using async ?
    const countryCode = event.target.value;
      // console.log("AYE >>>>>", countryCode);
      setCountry(countryCode);
    
    const url = countryCode === 'worldwide'
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      // All of the data from the country response
      setCountryInfo(data);
    })

  }; // grabs selected value from the dropdown menu and sets it to the country selected

  console.log("COUNTRY INFO >>>>>>>", countryInfo)

  return (
    <div className="app">
      <div className="app__left">
          
          <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
              <Select variant="outlined" onChange={onCountryChange} value={ country } >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {/* having the menuItem above sets the default state to Worldwide until we select a country from the dropdown menu */}

                {/* Loop through all the countries and show a dropdown list of options */}
                {
                  countries.map(country => (
                    <MenuItem value={ country.value }>{ country.name }</MenuItem>

                  ))
                }
                  {/* <MenuItem value="worldwide">Worldwide</MenuItem>      
                  <MenuItem value="worldwide">Option 2</MenuItem>
                  <MenuItem value="worldwide">Option 3</MenuItem>
                  <MenuItem value="worldwide">Option 4</MenuItem> */}
                  

              </Select>
          </FormControl>
        </div>
        
        <div className="app__stats">
            <InfoBox 
              title="Coronavirus Cases" 
              cases={countryInfo.todayCases} 
              total={countryInfo.cases} 
            />
            <InfoBox 
              title="Recovered" 
              cases={countryInfo.todayRecovered} 
              total={countryInfo.recovered}
            />
            <InfoBox 
              title="Deaths" 
              cases={countryInfo.todayDeaths} 
              total={countryInfo.deaths}
            />
        </div>
        
        <Map />

      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={ tableData } />
          <h3>Worldwide New Cases</h3>
          <LineGraph />
        </CardContent>

      </Card>
    </div>
  );
}

export default App;
