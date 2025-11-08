package com.pearl.backend.controllers;

import com.pearl.backend.appointment.AppointmentRequest;
import com.pearl.backend.entities.Appointment;
import com.pearl.backend.entities.Users;
import com.pearl.backend.repositories.AppointmentRepository;
import com.pearl.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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

    @GetMapping("/doctors/{doctorId}/appointments")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable UUID doctorId) {
        Users doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        List<Appointment> appointments = appointmentRepository.findByDoctor(doctor);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/users/{userId}/appointments")
    public ResponseEntity<List<Appointment>> getUserAppointments(@PathVariable UUID userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Appointment> appointments = appointmentRepository.findByPatient(user);
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        Users doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Users patient = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

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
