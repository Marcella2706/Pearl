package com.pearl.backend.medical;

import java.util.UUID;

public record DoctorDTO(
        UUID id,
        String name,
        String hospital,
        String role,
        String profilePhoto
) {}

