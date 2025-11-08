package com.pearl.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private LocalDateTime appointmentTime;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Users doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Users patient;
}
