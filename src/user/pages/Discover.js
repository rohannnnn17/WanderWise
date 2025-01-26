import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "../../places/components/PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import AdvancedSearchFilter from "../../shared/components/UIElements/AdvancedSearchFilter";
import "./DiscoverPlaces.css";

const DiscoverPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all places when the component is mounted
  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/allplaces/places"
        );
        setPlaces(response.data.places || response.data);
        setFilteredPlaces(response.data.places || response.data);
      } catch (err) {
        setError("Failed to fetch places. Please try again.");
      }
      setLoading(false);
    };

    fetchPlaces();
  }, []);

  // Search handler to filter places based on search query and category
  const searchHandler = async (filterData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/places/search",
        filterData
      ); // Call the new search endpoint
      setFilteredPlaces(response.data.places); // Update the state with the filtered places
    } catch (err) {
      setError("Error occurred while searching. Please try again.");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="center">
        <Card>
          <h2>Loading places...</h2>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center">
        <Card>
          <h2>{error}</h2>
        </Card>
      </div>
    );
  }

  if (filteredPlaces.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="discover-places">
      <AdvancedSearchFilter onSearch={searchHandler} />{" "}
      {/* Pass the handler to the filter */}
      <ul className="place-list">
        {filteredPlaces.map((place) => (
          <PlaceItem
            key={place.id}
            id={place.id}
            image={place.image}
            title={place.title}
            description={place.description}
            address={place.address}
            creatorId={place.creator}
            coordinates={place.location}
          />
        ))}
      </ul>
    </div>
  );
};

export default DiscoverPlaces;
