import React, { useRef, useEffect } from "react";
import L from "leaflet";
import "./Map.css";
import "leaflet/dist/leaflet.css";

const Map = (props) => {
  const mapRef = useRef();
  const { center, zoom } = props;

  useEffect(() => {
    const map = L.map(mapRef.current).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: "/market.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const marker = L.marker(center, { icon: customIcon }).addTo(map);

    marker.bindPopup("<b>Hello!</b><br>This is your marker.").openPopup();

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
