package com.pearl.backend.repositories;

import com.pearl.backend.entities.Appointment;
import com.pearl.backend.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctor(Users doctor);
    List<Appointment> findByPatient(Users patient);
    Optional<Appointment> findById(UUID id);
}
