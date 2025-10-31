'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useMap } from '@/app/context/MapContext';
import { motion } from 'framer-motion';
import { RefreshCw, MapPin } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '16px',
};

const defaultCenter = { lat: 40.7128, lng: -74.006 };

const mapOptions: Omit<google.maps.MapOptions, 'styles'> = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  zoomControl: true,
  disableDoubleClickZoom: false,
};

function safeGetComputedStyle(): CSSStyleDeclaration | null {
  if (typeof window === 'undefined' || !document.documentElement) return null;
  return getComputedStyle(document.documentElement);
}

function resolveThemeName(): string {
  if (typeof window === 'undefined' || !document.documentElement) return 'light';
  return document.documentElement.className || 'light';
}

function createThemeColors(rootStyles: CSSStyleDeclaration ,themeName: string) {
  return {
    accent: rootStyles.getPropertyValue('--color-primary').trim(),
    accentHover: rootStyles.getPropertyValue('--color-primary').trim(),
    background: rootStyles.getPropertyValue('--color-background').trim() ,
  };
}

function createMapStyles(rootStyles: CSSStyleDeclaration, themeName: string) {
  const backgroundColor = rootStyles.getPropertyValue('--color-background-secondary').trim();
  const foregroundColor = rootStyles.getPropertyValue('--color-foreground-muted').trim();
  const accentColor = rootStyles.getPropertyValue('--color-primary').trim();
  const borderColor = rootStyles.getPropertyValue('--color-border').trim();
  const backgroundPrimary = rootStyles.getPropertyValue('--color-background').trim();

  return [
    { elementType: 'geometry', stylers: [{ color: backgroundColor }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: backgroundPrimary }] },
    { elementType: 'labels.text.fill', stylers: [{ color: foregroundColor }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: borderColor }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: foregroundColor }] },
    { featureType: 'water', stylers: [{ color: accentColor }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: borderColor }] },
    { featureType: 'landscape', stylers: [{ color: backgroundColor }] },
  ];
}

export function MapDisplay() {
  const { isLoaded, onLoad, onUnmount, userLocation, places, selectedPlace, selectPlace } = useMap();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const lastStylesRef = useRef<string | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const debounceRef = useRef<number | null>(null);

  const [themeColors, setThemeColors] = useState(() => {
    const rs = safeGetComputedStyle();
    const tn = resolveThemeName();
    return createThemeColors(rs as any, tn);
  });

  const [mapStyles, setMapStyles] = useState(() => {
    const rs = safeGetComputedStyle();
    const tn = resolveThemeName();
    return createMapStyles(rs as any, tn);
  });

  const userOuterIcon = useMemo(() => {
    return userLocation
      ? {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: themeColors.accent,
          fillOpacity: 0.15,
          strokeColor: themeColors.accent,
          strokeWeight: 1,
          strokeOpacity: 0.3,
          scale: 20,
        }
      : undefined;
  }, [themeColors, userLocation]);

  const userInnerIcon = useMemo(() => {
    return userLocation
      ? {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: themeColors.accent,
          fillOpacity: 1,
          strokeColor: themeColors.background,
          strokeWeight: 3,
          scale: 8,
        }
      : undefined;
  }, [themeColors, userLocation]);

  const placeIcon = useMemo(() => {
    const g = typeof window !== 'undefined' && (window as any).google ? (window as any).google : null;
    const anchor = g ? new g.maps.Point(12, 24) : undefined;

    const iconObj: any = {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z",
      fillColor: themeColors.accentHover,
      fillOpacity: 0.95,
      strokeColor: themeColors.background,
      strokeWeight: 2,
      scale: 1.6,
    };

    if (anchor) iconObj.anchor = anchor;
    return iconObj as unknown as google.maps.Icon;
  }, [themeColors]);

  useEffect(() => {
    if (!map) return;
    const serialized = JSON.stringify(mapStyles);
    if (serialized === lastStylesRef.current) return;

    try {
      map.setOptions({ styles: mapStyles });
      lastStylesRef.current = serialized;
    } catch (e) {
      console.warn('Failed to set map styles:', e);
    }
  }, [map, mapStyles]);

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    onLoad(mapInstance);
  };

  const handleMapUnmount = () => {
    setMap(null);
    onUnmount();
  };

  useEffect(() => {
    const root = document.documentElement;
    if (!root) return;

    const applyThemeChanges = () => {
      const rs = safeGetComputedStyle();
      const tn = resolveThemeName();
      const newThemeColors = createThemeColors(rs as any, tn);
      const newMapStyles = createMapStyles(rs as any, tn);

      const colorsChanged = JSON.stringify(newThemeColors) !== JSON.stringify(themeColors);
      const stylesChanged = JSON.stringify(newMapStyles) !== JSON.stringify(mapStyles);

      if (colorsChanged) setThemeColors(newThemeColors);
      if (stylesChanged) setMapStyles(newMapStyles);
    };
    applyThemeChanges();

    const onMutations = () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => applyThemeChanges(), 100);
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          onMutations();
          break;
        }
      }
    });

    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-background-secondary rounded-2xl border border-border animate-pulse">
        <div className="text-foreground-muted text-lg">Loading Map...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute z-20 top-4 right-4 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => map && userLocation && map.panTo(userLocation)}
          className="p-3 rounded-full bg-background/70 backdrop-blur-lg border border-border shadow-md hover:bg-background-secondary transition"
          title="Recenter"
        >
          <RefreshCw size={18} className="text-foreground" />
        </motion.button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={14}
        onLoad={handleMapLoad}
        onUnmount={handleMapUnmount}
        options={{
          ...mapOptions,
          styles: mapStyles,
        }}
      >

  {userLocation && (
    <>
      <MarkerF
        position={userLocation}
        icon={userOuterIcon as google.maps.Symbol}
      />
      <MarkerF
        position={userLocation}
        title="Your Location"
        icon={userInnerIcon as google.maps.Symbol}
      />
    </>
  )}

  {places.map((place: any) => {
    const key =
      place.place_id ||
      `${place.geometry.location.lat}-${place.geometry.location.lng}`;

    return (
      <motion.div
        key={key}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <MarkerF
          position={place.geometry.location}
          title={place.name}
          onClick={() => selectPlace(place)}
          icon={{
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z",
            fillColor: themeColors.accent,
            fillOpacity: 0.9,
            strokeColor: themeColors.background,
            strokeWeight: 2,
            scale: 1.8,
          } as unknown as google.maps.Icon}
        />
      </motion.div>
    );
  })}

  {selectedPlace && (
  <InfoWindowF
    position={selectedPlace.geometry.location}
    onCloseClick={() => selectPlace(null)}
  >
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="p-4 bg-background/80 backdrop-blur-lg border border-border/50 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] min-w-[220px] max-w-[260px]"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-full">
          <MapPin size={18} className="text-primary" />
        </div>
        <h4 className="text-sm font-semibold text-foreground leading-tight">
          {selectedPlace.name}
        </h4>
      </div>

      {selectedPlace.vicinity && (
        <p className="text-xs text-foreground mb-3">
          {selectedPlace.vicinity}
        </p>
      )}

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          selectedPlace.name
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium text-primary hover:underline"
      >
        Open in Google Maps
      </a>
    </motion.div>
  </InfoWindowF>
)}
</GoogleMap>

    </div>
  );
}
