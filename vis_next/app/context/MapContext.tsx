'use client';

import {
  useJsApiLoader,
} from '@react-google-maps/api';
import {
  useState,
  useCallback,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';

export interface Place {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  vicinity: string;
  types: string[];
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
    setStatus('Finding hospitals near you...');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/places/nearby-osm?lat=${lat}&lng=${lng}&radius=3000&keyword=hospital`
      );

      if (!res.ok) throw new Error('Failed to fetch places from backend');

      const osmData = await res.json();

      if (!osmData.elements) {
        setStatus('No places found.');
        setPlaces([]);
        return;
      }

      const mapped: Place[] = osmData.elements
        .filter((el: any) => el.lat && el.lon && el.tags?.name)
        .map((el: any) => ({
          place_id: el.id.toString(),
          name: el.tags.name || 'Unnamed Place',
          geometry: {
            location: {
              lat: el.lat,
              lng: el.lon,
            },
          },
          vicinity: el.tags['addr:full'] || el.tags['addr:city'] || 'Address not available',
          types: [el.tags.amenity || 'unknown'],
        }));

      setPlaces(mapped);
      setStatus(mapped.length > 0 ? `Found ${mapped.length} hospitals nearby.` : 'No hospitals found.');
    } catch (error) {
      console.error(error);
      setStatus('Error finding nearby places.');
    }
  };

  useEffect(() => {
    if (map && isLoaded) {
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
  }, [map, isLoaded, panTo]);

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
