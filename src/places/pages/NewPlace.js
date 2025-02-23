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

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [placeType, setPlaceType] = useState(""); // State for place type
  const [placeTypeError, setPlaceTypeError] = useState(false); // State for validation error
  const [formState, inputHandler] = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
      address: { value: "", isValid: false },
      image: { value: null, isValid: false },
    },
    false
  );

  const history = useHistory();

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://wanderwise-yy6r.onrender.com";

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    if (!placeType) {
      setPlaceTypeError(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("placeType", placeType);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(`${API_BASE_URL}/api/places`, "POST", formData);
      history.push("/");
    } catch (err) {}
  };

  const placeTypeChangeHandler = (event) => {
    setPlaceType(event.target.value);
    setPlaceTypeError(false);
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
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image"
        />

        {/* Dropdown for selecting place type */}
        <div className="form-control">
          <label htmlFor="placeType">Place Type</label>
          <select
            id="placeType"
            value={placeType}
            onChange={placeTypeChangeHandler}
            required>
            <option value="">-- Select a Place Type --</option>
            <option value="Nature Spot">Nature Spot</option>
            <option value="Camping Spot">Camping Spot</option>
            <option value="Hotel">Hotel</option>
            <option value="Hostel">Hostel</option>
            <option value="PG">PG</option>
            <option value="Mall">Mall</option>
            <option value="Historic Place">Historic Place</option>
            <option value="Monument">Monument</option>
            <option value="Trekking Spot">Trekking Spot</option>
            <option value="Beach">Beach</option>
            <option value="Resort">Resort</option>
            <option value="Waterfall">Waterfall</option>
            <option value="Temple">Temple</option>
            <option value="Mosque">Mosque</option>
            <option value="Church">Church</option>
            <option value="Gurudwara">Gurudwara</option>
            <option value="Wildlife Sanctuary">Wildlife Sanctuary</option>
            <option value="Zoo">Zoo</option>
            <option value="Museum">Museum</option>
            <option value="Amusement Park">Amusement Park</option>
            <option value="Aquarium">Aquarium</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Cafe">Cafe</option>
            <option value="Bar">Bar</option>
            <option value="Nightclub">Nightclub</option>
            <option value="Library">Library</option>
            <option value="Park">Park</option>
            <option value="Garden">Garden</option>
            <option value="Shopping Complex">Shopping Complex</option>
            <option value="Cultural Center">Cultural Center</option>
            <option value="Art Gallery">Art Gallery</option>
            <option value="Cinema Hall">Cinema Hall</option>
            <option value="Sports Complex">Sports Complex</option>
            <option value="Stadium">Stadium</option>
            <option value="Convention Center">Convention Center</option>
            <option value="Food Court">Food Court</option>
            <option value="Street Market">Street Market</option>
            <option value="Railway Station">Railway Station</option>
            <option value="Airport">Airport</option>
            <option value="Bus Stand">Bus Stand</option>
            <option value="Ferry Terminal">Ferry Terminal</option>
          </select>
          {placeTypeError && (
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
