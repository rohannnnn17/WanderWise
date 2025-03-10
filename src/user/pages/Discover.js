import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "../../places/components/PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import AdvancedSearchFilter from "../../shared/components/UIElements/AdvancedSearchFilter";
import "./DiscoverPlaces.css";

const DiscoverPlaces = () => {
  const [places, setPlaces] = useState([]); // Stores all places
  const [filteredPlaces, setFilteredPlaces] = useState([]); // Stores filtered places
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://wanderwise-yy6r.onrender.com");

  // Fetch all places when component mounts
  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/allplaces/places`
        );
        const placesData = response.data.places || response.data;
        setPlaces(placesData);
        setFilteredPlaces(placesData);
      } catch (err) {
        setError("❌ Failed to fetch places. Please try again.");
      }

      setLoading(false);
    };

    fetchPlaces();
  }, []);

  // Handle search/filter requests
  const searchHandler = async (filterData) => {
    setLoading(true);
    setError(null);

    if (!filterData.searchQuery && !filterData.categoryFilter) {
      setError("⚠ Please enter a search term or select a category.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/places/search`,
        filterData
      );
      setFilteredPlaces(response.data.places || []);
    } catch (err) {
      setError("❌ No places found for this search. Try different filters.");
      setFilteredPlaces([]);
    }

    setLoading(false);
  };

  // Reset filters & show all places
  const resetFilters = () => {
    setFilteredPlaces(places);
    setError(null);
  };

  return (
    <div className="discover-places">
      <AdvancedSearchFilter onSearch={searchHandler} />

      {loading && (
        <div className="center">
          <Card>
            <h2>🔄 Loading places...</h2>
          </Card>
        </div>
      )}

      {!loading && error && (
        <div className="center">
          <Card>
            <h2>{error}</h2>
            {places.length > 0 && (
              <Button onClick={resetFilters} size="large">
                Reset Filters
              </Button>
            )}
          </Card>
        </div>
      )}

      {!loading && !error && filteredPlaces.length === 0 && (
        <div className="place-list center">
          <Card>
            <h2>⚠ No places found. Try searching differently!</h2>
            <Button onClick={resetFilters} size="large">
              Reset Filters
            </Button>
          </Card>
        </div>
      )}

      {!loading && !error && filteredPlaces.length > 0 && (
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
      )}
    </div>
  );
};

export default DiscoverPlaces;
