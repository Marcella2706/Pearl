package com.pearl.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import lombok.extern.slf4j.Slf4j;
import java.util.Map;

@Slf4j
@Service
public class OSMService {

    @Autowired
    private RestTemplate restTemplate;

    private final String OVERPASS_API_URL = "https://overpass-api.de/api/interpreter?data={query}";

    public Object findNearbyPlaces(double lat, double lng, int radius, String keyword) {
        String query = String.format(
                "[out:json];node(around:%d,%f,%f)[amenity=%s];out;",
                radius, lat, lng, keyword.toLowerCase()
        );
        Map<String, String> params = Map.of("query", query);

        log.info("Querying Overpass API with query: {}", query);

        try {
            return restTemplate.getForObject(OVERPASS_API_URL, Object.class, params);

        } catch (Exception e) {
            log.error("Error finding nearby places from Overpass API: {}", e.getMessage(), e);
            return null;
        }
    }
}