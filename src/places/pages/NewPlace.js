import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const PLACE_TYPES = [
  "Nature Spot",
  "Camping Spot",
  "Hotel",
  "Hostel",
  "PG",
  "Mall",
  "Historic Place",
  "Monument",
  "Trekking Spot",
  "Beach",
  "Resort",
  "Waterfall",
  "Temple",
  "Mosque",
  "Church",
  "Gurudwara",
  "Wildlife Sanctuary",
  "Zoo",
  "Museum",
  "Amusement Park",
  "Aquarium",
  "Restaurant",
  "Cafe",
  "Bar",
  "Nightclub",
  "Library",
  "Park",
  "Garden",
  "Shopping Complex",
  "Cultural Center",
  "Art Gallery",
  "Cinema Hall",
  "Sports Complex",
  "Stadium",
  "Convention Center",
  "Food Court",
  "Street Market",
  "Railway Station",
  "Airport",
  "Bus Stand",
  "Ferry Terminal",
];

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://wanderwise-yy6r.onrender.com");

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [placeType, setPlaceType] = useState("");
  const [imageError, setImageError] = useState(false);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
      address: { value: "", isValid: false },
      image: { value: null, isValid: false },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    if (!placeType) {
      console.error("Place type is required.");
      return;
    }

    if (!formState.inputs.image.value) {
      setImageError(true);
      console.error("No image selected!");
      return;
    }

    setImageError(false);

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("placeType", placeType);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value); // ✅ This should be an image URL from Cloudinary

      await sendRequest(`${API_BASE_URL}/api/places`, "POST", formData);
      history.push("/");
    } catch (err) {
      console.error("Error submitting place:", err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}

        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />

        <Input
          id="description"
          element="textarea"
          label="Review"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid Review (at least 5 characters)."
          onInput={inputHandler}
        />

        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />

        {/* Image Upload */}
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image"
        />
        {imageError && <p className="error-text">Please upload an image.</p>}

        {/* Place Type Dropdown */}
        <div className="form-control">
          <label htmlFor="placeType">Place Type</label>
          <select
            id="placeType"
            value={placeType}
            onChange={(e) => setPlaceType(e.target.value)}
            required>
            <option value="">-- Select a Place Type --</option>
            {PLACE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {!placeType && (
            <p className="error-text">Please select a place type.</p>
          )}
        </div>

        <Button type="submit" disabled={!formState.isValid || !placeType}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
