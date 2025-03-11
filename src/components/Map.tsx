import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  onPolygonCreated?: (coordinates: number[][]) => void;
}

const MapComponent: React.FC<MapProps> = ({ onPolygonCreated }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle window resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Invalidate map size when window resizes
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize the map with a default location (center of US - Kansas)
      const defaultLocation: [number, number] = [39.8283, -98.5795];
      const map = L.map(mapRef.current).setView(defaultLocation, 5);
      mapInstanceRef.current = map;
      
      // Add tile layers
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }).addTo(map);
      
      // Create arrays to store points and markers
      const points: L.LatLng[] = [];
      const markers: L.Marker[] = [];
      let polyline: L.Polyline | null = null;
      let polygon: L.Polygon | null = null;
      
      // Add click handler to map
      map.on('click', (e: L.LeafletMouseEvent) => {
        // Add the clicked point
        points.push(e.latlng);
        
        // Add a marker at the clicked point
        const marker = L.marker(e.latlng).addTo(map);
        markers.push(marker);
        
        // If we have a polyline already, remove it
        if (polyline) {
          map.removeLayer(polyline);
        }
        
        // If we have a polygon already, remove it
        if (polygon) {
          map.removeLayer(polygon);
        }
        
        // If we have at least 2 points, draw a polyline
        if (points.length >= 2) {
          polyline = L.polyline(points, { color: 'blue' }).addTo(map);
        }
        
        // If we have at least 3 points, draw a polygon
        if (points.length >= 3) {
          polygon = L.polygon(points, { color: 'blue', fillOpacity: 0.3 }).addTo(map);
        }
      });
      
      // Add double-click handler to complete the polygon
      map.on('dblclick', (e: L.LeafletMouseEvent) => {
        // Prevent adding a new point on double-click
        L.DomEvent.stopPropagation(e);
        
        if (points.length >= 3 && onPolygonCreated) {
          const coordinates = points.map(p => [p.lat, p.lng]);
          onPolygonCreated(coordinates);
        }
      });
      
      // Create and add instruction control
      const createInstructionsControl = () => {
        const instructionsDiv = L.DomUtil.create('div', 'map-instructions');
        instructionsDiv.innerHTML = `
          <p>${isMobile ? 'Tap' : 'Click'} to add points. ${isMobile ? 'Double-tap' : 'Double-click'} to complete.</p>
          <button class="clear-button">Clear Points</button>
        `;
        
        // Add click handler to clear button
        const addClearButtonHandler = () => {
          const clearButton = instructionsDiv.querySelector('.clear-button');
          if (clearButton) {
            clearButton.addEventListener('click', () => {
              // Remove all markers
              markers.forEach(marker => map.removeLayer(marker));
              markers.length = 0;
              
              // Remove polyline if it exists
              if (polyline) {
                map.removeLayer(polyline);
                polyline = null;
              }
              
              // Remove polygon if it exists
              if (polygon) {
                map.removeLayer(polygon);
                polygon = null;
              }
              
              // Clear points array
              points.length = 0;
            });
          }
        };
        
        addClearButtonHandler();
        return instructionsDiv;
      };
      
      // Add the instructions to the map
      const instructionsControl = new L.Control({ position: 'bottomleft' });
      instructionsControl.onAdd = createInstructionsControl;
      instructionsControl.addTo(map);
      
      // Add zoom control with positioning based on device
      L.control.zoom({
        position: isMobile ? 'topright' : 'topleft'
      }).addTo(map);
      
      // Handle mobile specific adjustments
      if (isMobile) {
        // Adjust zoom level for mobile
        map.setZoom(4);
      }
      
      // Ensure map renders correctly after load
      setTimeout(() => map.invalidateSize(), 100);
    }
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onPolygonCreated, isMobile]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: isMobile ? '70vh' : '80vh', 
        width: '100%',
        maxHeight: '800px' 
      }}
      className="leaflet-map-container"
    ></div>
  );
};

export default MapComponent; 