import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// SmoothWheelZoom implementation
// Based on https://github.com/mutsuyuki/Leaflet.SmoothWheelZoom
const setupSmoothWheelZoom = (map: L.Map, sensitivity: number) => {
  // Add smooth wheel zoom functionality to Leaflet
  const smoothWheelZoom = (e: WheelEvent) => {
    if (!map) return;
    
    // Cancel the native scroll event
    e.preventDefault();
    e.stopPropagation();
    
    // Calculate zoom level change based on the wheel delta
    const delta = e.deltaY;
    const zoomDelta = -delta / 300 * sensitivity;
    
    // Get current map center and zoom
    const zoom = map.getZoom();
    if (zoom === undefined) return;
    
    // Get the mouse position on the map
    const mousePos = map.mouseEventToContainerPoint(e as unknown as L.LeafletMouseEvent);
    const targetPoint = map.containerPointToLatLng(mousePos);
    
    // Set the new zoom level
    const targetZoom = zoom + zoomDelta;
    
    // Schedule the zoom animation
    map.flyTo(targetPoint, targetZoom, {
      duration: 0.25, // Shorter animation time for responsiveness
      easeLinearity: 0.5
    });
  };
  
  // Add event listener
  map.getContainer().addEventListener('wheel', smoothWheelZoom, { passive: false });
  
  // Return function to remove event listener when component unmounts
  return () => {
    map.getContainer().removeEventListener('wheel', smoothWheelZoom);
  };
};

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
      
      // Create map with improved zoom settings
      const map = L.map(mapRef.current, {
        center: defaultLocation,
        zoom: 5,
        zoomSnap: 0.1,          // Allow finer fractional zoom levels
        zoomDelta: 0.25,        // Change zoom level in smaller increments
        wheelPxPerZoomLevel: 120, // Require more wheel movement per zoom level (default is 60)
        wheelDebounceTime: 40,  // Debounce wheel events for smoother experience
        scrollWheelZoom: false, // Disable default scroll zoom as we'll use our custom smoother version
      });
      
      mapInstanceRef.current = map;
      
      // Setup smooth wheel zoom with medium sensitivity
      const cleanupSmoothZoom = setupSmoothWheelZoom(map, 1.5);
      
      // Add base layer controls
      const baseMaps: Record<string, L.Layer> = {};
      const overlayMaps: Record<string, L.Layer> = {};
      
      // Add ESRI satellite imagery as base layer
      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }).addTo(map);
      baseMaps['Satellite'] = satelliteLayer;
      
      // Add OpenStreetMap as an alternative base layer for context
      const streetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
      baseMaps['Street Map'] = streetMapLayer;
      
      // Add Stamen's terrain layer with topographic features
      const terrainLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 18
      });
      baseMaps['Terrain'] = terrainLayer;
      
      // Add transparent labels/borders overlay layer
      const labelsLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        opacity: 0.8
      }).addTo(map);
      overlayMaps['Labels'] = labelsLayer;
      
      // Add ESRI boundaries overlay
      const boundariesLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
        opacity: 0.7
      }).addTo(map);
      overlayMaps['Boundaries'] = boundariesLayer;
      
      // Add layer control to the map
      L.control.layers(baseMaps, overlayMaps, {
        position: 'topright',
        collapsed: isMobile
      }).addTo(map);
      
      // Create arrays to store points and markers
      const points: L.LatLng[] = [];
      const markers: L.Marker[] = [];
      let polyline: L.Polyline | null = null;
      let polygon: L.Polygon | null = null;
      
      // Simple flag to track if we're drawing a polygon
      let isDrawing = false;
      
      // Function to update the visual representation of the polygon
      const updatePolygonVisuals = () => {
        // Remove existing polyline and polygon
        if (polyline) {
          map.removeLayer(polyline);
          polyline = null;
        }
        
        if (polygon) {
          map.removeLayer(polygon);
          polygon = null;
        }
        
        // Add new polyline if we have at least 2 points
        if (points.length >= 2) {
          polyline = L.polyline(points, { color: 'blue' }).addTo(map);
        }
        
        // Add new polygon if we have at least 3 points
        if (points.length >= 3) {
          polygon = L.polygon(points, { color: 'blue', fillOpacity: 0.3 }).addTo(map);
        }
      };
      
      // Function to clear all drawing data
      const clearDrawing = () => {
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
        
        // Reset drawing state
        isDrawing = false;
      };
      
      // Start/continue drawing on map click
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (!isDrawing) {
          // Start a new drawing session
          clearDrawing();
          isDrawing = true;
        }
        
        // Add the clicked point
        points.push(e.latlng);
        
        // Add a marker at the clicked point
        const marker = L.marker(e.latlng).addTo(map);
        markers.push(marker);
        
        // Update the polygon visuals
        updatePolygonVisuals();
      });
      
      // Complete the polygon on double-click
      map.on('dblclick', (e: L.LeafletMouseEvent) => {
        // Prevent the default double-click behavior (zoom)
        e.originalEvent.preventDefault();
        L.DomEvent.stopPropagation(e);
        
        // Only complete if we have at least 3 points
        if (points.length >= 3 && isDrawing) {
          // Convert to the format expected by the callback
          const coordinates = points.map(p => [p.lat, p.lng]);
          
          // Call the callback with the polygon coordinates
          if (onPolygonCreated) {
            onPolygonCreated(coordinates);
          }
          
          // Mark drawing as complete
          isDrawing = false;
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
            clearButton.addEventListener('click', (e: Event) => {
              // Prevent the event from propagating to the map
              e.stopPropagation();
              
              // Clear the drawing
              clearDrawing();
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
        cleanupSmoothZoom(); // Remove smooth zoom event listener
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