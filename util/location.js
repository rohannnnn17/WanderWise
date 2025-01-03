// util/location.js
const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = "7624a799ef064a99890fdad050e5eaf6";

async function getCoordsForAddress(address) {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address
      )}&key=${API_KEY}`
    );

    const data = response.data;

    if (!data || !data.results || data.results.length === 0) {
      console.log("No results found.");
      const error = new HttpError(
        "Could not find location for the specified address",
        422
      );
      throw error;
    } else {
      const coordinates = data.results[0].geometry;
      return coordinates; // Return the coordinates object
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    throw new HttpError("Could not retrieve coordinates for the address", 500);
  }
}

// Make sure you're exporting the function
module.exports = getCoordsForAddress;
