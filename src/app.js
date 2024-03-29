const path = require('path')
const express = require('express');
const hbs = require('hbs')
const app = express();
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode')
const port = 3000

// Define paths for Express config
const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

console.log("testingasd")

// Setup static directory to serve
app.use(express.static(publicDirectory))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Osama'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About me",
        name: 'Osama'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help",
        message: 'help message',
        name: "Osama"
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            });
        })
        
    })
   
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    });
})

app.get('/help/*', (req, res) => {
    res.render("error", {
        errorMessage: "Help article not found", title: "404",
        name: 'Osama'
    })
})

app.get('*', (req, res) => {
    res.render("error", {
        errorMessage: "Page not found",
        title: "404",
        name: 'Osama'
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})