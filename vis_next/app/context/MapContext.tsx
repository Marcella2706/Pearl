'use client';

import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  InfoWindowF,
} from '@react-google-maps/api';
import {
  useState,
  useCallback,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';

// This should match the data structure you send from your backend
export interface Place {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  vicinity: string; // The address
  types: string[]; // e.g., ['doctor', 'hospital', 'health']
}

interface MapContextType {
  isLoaded: boolean;
  map: google.maps.Map | null;
  onLoad: (map: google.maps.Map) => void;
  onUnmount: () => void;
  userLocation: { lat: number; lng: number } | null;
  places: Place[];
  status: string;
  selectedPlace: Place | null;
  selectPlace: (place: Place | null) => void;
  panTo: (position: { lat: number; lng: number }) => void;
}

const MapContext = createContext<MapContextType | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [status, setStatus] = useState('Initializing map...');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const panTo = useCallback(
    (position: { lat: number; lng: number }) => {
      if (map) {
        map.panTo(position);
        map.setZoom(14);
      }
    },
    [map]
  );

  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    setStatus('Finding doctors and hospitals...');
    try {
      const res = await fetch(
        `/api/find-nearby?lat=${lat}&lng=${lng}&types=doctor,hospital`
      );
      
      if (!res.ok) throw new Error('Failed to fetch places from backend');
      
      const data: Place[] = await res.json();
      setPlaces(data);
      setStatus(data.length > 0 ? `Found ${data.length} places.` : 'No places found.');
    } catch (error) {
      console.error(error);
      setStatus('Error finding nearby places.');
    }
  };

  useEffect(() => {
    if (map) {
      setStatus('Map loaded. Getting your location...');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(pos);
            panTo(pos); 
            fetchNearbyPlaces(pos.lat, pos.lng); 
          },
          () => {
            setStatus('Location access denied. Please enable it in your browser.');
          }
        );
      } else {
        setStatus('Geolocation not supported by your browser.');
      }
    }
  }, [map, panTo]);
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const selectPlace = (place: Place | null) => {
    setSelectedPlace(place);
    if (place) {
      panTo(place.geometry.location);
    }
  };
  const value = {
    isLoaded,
    map,
    onLoad,
    onUnmount,
    userLocation,
    places,
    status,
    selectedPlace,
    selectPlace,
    panTo,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}