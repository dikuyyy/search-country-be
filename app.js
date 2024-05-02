const express = require('express');
const helmet = require('helmet')
const app = express();
const port = 3000;

const data = require('./countriesV2.json');

app.use("/images", express.static(__dirname + "/public/data"));
app.get('/name/:name', (req, res) => {
    const name = req.params.name;
    const isFullName = req.query.fullName === 'true';
    const filteredCountries = data.filter(country =>
        !isFullName ? country.name.toLowerCase().includes(name.toLowerCase()) : country.name.toLowerCase() === name.toLowerCase()
    );
    let response = filteredCountries.map((item) => {
        return {
            code: item.alpha3Code,
            name: item.name,
            imageURL: `/images/${item.flag}`,
        }
    })

    if (isFullName) {
        response = {
            ...filteredCountries[0]
        }
    }
    if (filteredCountries.length > 0) {
        res.json(response);
    } else {
        res.status(404).send('No country found with that name');
    }
})

app.get('/callingcode/:code', (req, res) => {
    const code = req.params.code;
    const filteredCountries = data.filter(country => country.callingCodes.includes(code));
    if (filteredCountries.length > 0) {
        res.json(filteredCountries);
    } else {
        res.status(404).send('No country found with that name');
    }
})

app.get('/currency/:currencies', (req, res) => {
    const currencies = req.params.currencies;
    const filteredCountries = data.filter(country => country.currencies.some(currency => currency.code === currencies));
    const response = filteredCountries.map((item) => {
        return {
            name: item.name,
            currencies: item.currencies
        }
    })
    if (filteredCountries.length > 0) {
        res.json(response);
    } else {
        res.status(404).send('No country found with that name');
    }
})



app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});