import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Box, Typography } from "@mui/material"; // Import Material UI components

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://wanderwise-yy6r.onrender.com";

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${API_BASE_URL}/api/places/user/${userId}`
        );

        console.log("✅ API Response:", responseData.places); // Debugging log
        setLoadedPlaces(responseData.places);
      } catch (err) {
        console.error("❌ Fetch Error:", err);
      }
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && loadedPlaces.length > 0 && (
        <PlaceList items={loadedPlaces} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
