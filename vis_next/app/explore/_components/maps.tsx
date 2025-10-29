'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useMap } from '@/app/context/MapContext';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '8px',
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

function createMapStyles(rootStyles: CSSStyleDeclaration, themeName: string){ 
  let backgroundColor, foregroundColor, accentColor, borderColor, backgroundPrimary;
    backgroundColor = rootStyles.getPropertyValue('--color-background-secondary').trim();
    foregroundColor = rootStyles.getPropertyValue('--color-foreground-muted').trim();
    accentColor = rootStyles.getPropertyValue('--color-primary').trim();
    borderColor = rootStyles.getPropertyValue('--color-border').trim();
    backgroundPrimary = rootStyles.getPropertyValue('--color-background').trim();
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
          fillOpacity: 0.2,
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
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor: themeColors.accentHover,
      fillOpacity: 0.9,
      strokeColor: themeColors.background,
      strokeWeight: 2,
      scale: 1.5,
    };

    if (anchor) {
      iconObj.anchor = anchor;
    }

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
      debounceRef.current = window.setTimeout(() => {
        applyThemeChanges();
      }, 100);
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
      <div className="flex items-center justify-center h-[600px] bg-background-secondary text-foreground-muted rounded-lg border border-border">
        Loading Map...
      </div>
    );
  }

  return (
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
          <MarkerF position={userLocation} icon={userOuterIcon as unknown as google.maps.Icon} />
          <MarkerF position={userLocation} title="Your Location" icon={userInnerIcon as unknown as google.maps.Icon} />
        </>
      )}

      {places.map((place: any) => (
        <MarkerF
          key={place.place_id || `${place.geometry.location.lat}-${place.geometry.location.lng}`}
          position={place.geometry.location}
          title={place.name}
          onClick={() => selectPlace(place)}
          icon={placeIcon}
        />
      ))}

      {selectedPlace && (
        <InfoWindowF position={selectedPlace.geometry.location} onCloseClick={() => selectPlace(null)}>
          <div className="p-2 bg-background border border-border rounded-lg shadow-lg">
            <strong className="text-foreground font-semibold">{selectedPlace.name}</strong>
            <p className="text-foreground-muted text-sm mt-1">{selectedPlace.vicinity}</p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
