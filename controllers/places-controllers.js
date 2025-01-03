const HttpError = require("../models/http-error");
const Place = require("../models/place");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const mongoose = require("mongoose");
const User = require("../models/user");

// Get place by ID
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, we could not find a place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided ID.",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

// Get places by user ID
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided User ID.", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

// Create a new place
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;
  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    console.error("Error getting coordinates:", error);
    return next(
      new HttpError("Could not fetch coordinates. Please try again.", 500)
    );
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: "https://picsum.photos/id/237/200/300", // Placeholder image
    creator,
  });

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Save the place in the transaction
    await createdPlace.save({ session });

    const user = await User.findById(creator).session(session);
    if (!user) {
      console.error("User not found:", creator);
      throw new HttpError("Could not find user for provided ID.", 404);
    }

    user.places.push(createdPlace);

    await user.save({ session });

    await session.commitTransaction();
    res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
  } catch (err) {
    // Log the error for debugging
    console.error("Error during place creation or user update:", err);

    // If something goes wrong, abort the transaction
    await session.abortTransaction();
    return next(new HttpError("Creating Place Failed. Please try again.", 500));
  } finally {
    // End the session
    session.endSession();
  }
};

// Update an existing place
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided ID.", 404)
    );
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// Delete a place
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    // Attempt to find the place by its ID and populate the creator field
    place = await Place.findById(placeId).populate("creator");
    if (!place) {
      return next(
        new HttpError("Could not find a place for the provided ID.", 404)
      );
    }
    console.log("Found place:", place);
  } catch (err) {
    console.error("Error fetching place:", err);
    return next(
      new HttpError(
        "Something went wrong while trying to fetch the place.",
        500
      )
    );
  }

  // Start session for transaction
  const sess = await mongoose.startSession();
  sess.startTransaction();

  try {
    // Delete the place using deleteOne
    await Place.deleteOne({ _id: placeId }, { session: sess });
    console.log("Place removed:", placeId);

    // Check if the creator exists and has a valid places array
    if (place.creator && place.creator.places) {
      place.creator.places.pull(placeId);
      console.log("Updated creator places array:", place.creator.places);

      // Save the updated creator (user)
      await place.creator.save({ session: sess });
      console.log("Creator updated:", place.creator._id);
    } else {
      console.error("No valid creator found or places array is missing.");
      throw new HttpError("Failed to update creator's places.", 500);
    }

    // Commit the session transaction
    await sess.commitTransaction();
    console.log("Transaction committed.");
  } catch (err) {
    // If an error occurs during the transaction, abort the transaction and log the error
    console.error("Error during transaction:", err);
    await sess.abortTransaction();
    return next(
      new HttpError("Something went wrong, could not delete the place.", 500)
    );
  } finally {
    // End the session after the transaction is complete
    sess.endSession();
  }

  // Send success response after successful deletion
  res.status(200).json({ message: "Deleted place successfully." });
};

// Exports
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
