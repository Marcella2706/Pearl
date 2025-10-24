package com.pearl.backend.controllers;

import com.pearl.backend.services.OSMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/places")
public class LocationController {
    @Autowired
    private OSMService osmService;

    @GetMapping("/nearby-osm")
    public ResponseEntity<Object> getNearbyPlacesOsm(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5000") int radius,
            @RequestParam(defaultValue = "Hospital") String keyword) {

        Object response = osmService.findNearbyPlaces(lat, lng, radius, keyword);
        return ResponseEntity.ok(response);
    }
}
