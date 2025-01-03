const express = require("express");
const HttpError = require("./models/http-error");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const mongoose = require("mongoose");

const app = express();

app.use(express.json()); // Use express.json() to parse JSON bodies

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept , Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

app.use("/api/places", placesRoutes); // Use places routes
app.use("/api/users", usersRoutes); // Use users routes

// Error handler for undefined routes
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

// Global error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error); // Forward to default error handler if headers already sent
  }
  res.status(error.code || 500); // Set status code from error or default to 500
  res.json({ message: error.message || "An unknown error occurred!" });
});

// MongoDB connection and server start
mongoose
  .connect(
    "mongodb+srv://rohan17pawar:PbikytKbJnzzgyjB@cluster0.u3tyj.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
