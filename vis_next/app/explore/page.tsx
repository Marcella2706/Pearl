'use client';

import React, { useState, useMemo } from 'react';
import ExploreHeader from "./_components/explore_Header";
import { MapProvider, useMap } from "../context/MapContext";
import { MapDisplay } from "./_components/maps";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Hospital } from "lucide-react";
import clsx from "clsx";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function HospitalSidebar() {
  const { places, userLocation, selectPlace, selectedPlace } = useMap();
  const [searchQuery, setSearchQuery] = useState("");

  const hospitals = useMemo(() => {
    if (!places || !userLocation) return [];

    return places
      .map((p: any) => {
        const loc = p.geometry?.location;
        const distance = loc
          ? (() => {
              const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
              const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
              return haversineDistance(userLocation.lat, userLocation.lng, lat, lng).toFixed(2);
            })()
          : "–";
        return { ...p, distance };
      })
      .filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance));
  }, [places, userLocation, searchQuery]);

  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80 }}
      className="xl:w-[350px] w-full flex flex-col bg-background-secondary/60 backdrop-blur-lg border border-border rounded-2xl shadow-lg p-5"
      style={{ height: "calc(100vh - 96px)" }} 
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-foreground-muted" size={18} />
          <input
            type="text"
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-background border border-border text-foreground placeholder:text-foreground-muted focus:ring-2 focus:ring-primary transition"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {hospitals.length > 0 ? (
          hospitals.map((h: any, i: number) => (
            <motion.div
              key={h.place_id || i}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={() => selectPlace(h)}
              className={clsx(
                "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition",
                selectedPlace?.place_id === h.place_id
                  ? "bg-primary/10 border-primary"
                  : "bg-background/60 border-border hover:shadow-md"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-linear-to-tr from-primary/40 to-primary/10 flex items-center justify-center">
                <Hospital className="text-primary" size={20} />
              </div>

              <div className="flex-1">
                <p className="font-medium text-foreground leading-tight">{h.name}</p>
                <p className="text-sm text-foreground-muted">{h.vicinity}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-foreground-muted">
                  <MapPin size={14} />
                  <span>{h.distance} km</span>
                  {h.rating && (
                    <>
                      <Star size={14} className="text-yellow-400" />
                      <span>{h.rating}</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-foreground-muted text-sm mt-4">
            {userLocation ? "No hospitals found nearby." : "Fetching location..."}
          </p>
        )}
      </div>
    </motion.aside>
  );
}

export default function Page() {
  return (
    <>
      <ExploreHeader />
      <MapProvider>
        <div className="relative w-full flex flex-col xl:flex-row gap-6 px-6 bg-background min-h-[calc(100vh-96px)]">
          <HospitalSidebar />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex-1 rounded-2xl overflow-hidden shadow-2xl border border-border"
            style={{ height: "calc(100vh - 96px)" }} 
          >
            <MapDisplay />
          </motion.div>
        </div>
      </MapProvider>
    </>
  );
}
