import React, { useRef, useEffect } from "react";
import L from "leaflet";
import "./Map.css";
import "leaflet/dist/leaflet.css";

const Map = (props) => {
  const mapRef = useRef();
  const { center, zoom } = props;

  useEffect(() => {
    // Initialize the map
    const map = L.map(mapRef.current).setView(center, zoom);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Create a custom marker icon
    const customIcon = L.icon({
      iconUrl: "/market.png",
      iconSize: [32, 32], // Set the size of the marker image
      iconAnchor: [16, 32], // Anchor point of the marker (where the marker is placed)
      popupAnchor: [0, -32], // Position of the popup relative to the marker
    });

    // Add a marker with the custom icon
    const marker = L.marker(center, { icon: customIcon }).addTo(map);

    // Optional: Add a popup to the marker
    marker.bindPopup("<b>Hello!</b><br>This is your marker.").openPopup();

    // Cleanup the map on component unmount
    return () => {
      map.remove();
    };
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className="map"
      style={{ height: "400px", width: "100%" }}></div>
  );
};

export default Map;
