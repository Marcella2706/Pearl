package com.pearl.backend.controllers;

import com.pearl.backend.appointment.AppointmentRequest;
import com.pearl.backend.entities.Appointment;
import com.pearl.backend.entities.Users;
import com.pearl.backend.repositories.AppointmentRepository;
import com.pearl.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AppointmentController {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    @GetMapping("/doctors")
    public ResponseEntity<List<Users>> getAllDoctors() {
        List<Users> doctors = userRepository.findByRole("DOCTOR");
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/me/appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof Users currentUser)) {
            throw new RuntimeException("Unauthorized");
        }

        List<Appointment> appointments;
        if ("DOCTOR".equalsIgnoreCase(currentUser.getRole())) {
            appointments = appointmentRepository.findByDoctor(currentUser);
        } else {
            appointments = appointmentRepository.findByPatient(currentUser);
        }

        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody AppointmentRequest request
    ) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof Users currentUser)) {
            throw new RuntimeException("Unauthorized");
        }

        Users patient = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Users doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .description(request.getDescription())
                .appointmentTime(request.getAppointmentTime())
                .build();

        appointmentRepository.save(appointment);
        return ResponseEntity.ok(appointment);
    }
}
