import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core';
import './App.css';


function App() {
  const [countries, setCountries] =  useState([
    'USA', 'UK', 'India'
  ]);
// STATE = How to write a variable in React

// https://disease.sh/v3/covid-19/countries

// USEEFFECT = Runs a piece of code based on a given condition

  useEffect(() => {
    // The code inside here will run ONCE when the component loads and not again
    // async -> send a request to a server, wait for it, then do something with the information
    const getCountriesData = async () => {
      await fetch ("ttps://disease.sh/v3/covid-19/countries")
      // using fetch is the same as using axios
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, // United States, United Kingdom, etc.
            value: country.countryInfo.iso2 // UK, USA, FR
          }
        ))
      })
    }
  }, []);

  return (
    <div className="App">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
            <Select variant="outlined" value="abc" >
              {/* Loop through all the countries and show a dropdown list of options */}
              {
                countries.map(country => (
                  <MenuItem value="worldwide">{ country }</MenuItem>

                ))
              }
                {/* <MenuItem value="worldwide">Worldwide</MenuItem>      
                <MenuItem value="worldwide">Option 2</MenuItem>
                <MenuItem value="worldwide">Option 3</MenuItem>
                <MenuItem value="worldwide">Option 4</MenuItem> */}
                

            </Select>
        </FormControl>
      </div>
      

      {/*Header */}
      {/* Title + Select input dropdown field*/}

      {/* InfoBox */}
      {/* InfoBox */}
      {/* InfoBox */}

      {/* Table */}
      {/* Graph */}

      {/* Map */}

    </div>
  );
}

export default App;
