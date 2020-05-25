const path = require("path");
const express = require("express");
const app = express();
const hbs = require("hbs");
const forecast = require("./utils/forecast.js");
const geocode = require("./utils/geocode.js");
// Define paths for Express Config
//console.log(__dirname);

const publicLocation = path.join(__dirname, "../public");
const viewsLocation = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

//Setup HandleBars and views Location
app.set("view engine", "hbs");
app.set("views", viewsLocation);
hbs.registerPartials(partialPath);
//Setup Static Directory to serve
app.use(express.static(publicLocation));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Ashutosh Thakur",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Creator",
    name: "Ashutosh Thakur",
  });
});
app.get("/help", (req, res) => {
  res.render("help", {
    title: "HELP SECTION",
    message: "This is help section which would help you of all your queries",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error,
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error,
        });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error,
          });
        }
        res.send({
          forecast: forecastData,
          location,
        });
      });
    }
  );
  //res.send([{address: req.query.address, forecast: "35 degrees celcius"}]);
});
app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide search Term",
    });
  }
  console.log(req.query.search);
  res.send({ products: [] });
});
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "ERROR ",
    message: "Help article not found",
    name: "Ashutosh Thakur",
  });
});
app.get("*", (req, res) => {
  res.render("404", {
    title: "ERROR 404",
    message: "Page not Found",
    name: "Ashutosh",
  });
});
app.listen(3000, () => {
  console.log("Server is on port 3000");
});
