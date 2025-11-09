package com.pearl.backend.medical;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AppointmentDto {
    private String id;
    private UserDto doctor;
    private UserDto patient;
    private LocalDateTime appointmentTime;
    private String description;
    private String status;
}
