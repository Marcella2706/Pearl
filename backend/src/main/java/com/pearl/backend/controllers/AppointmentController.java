package com.pearl.backend.controllers;

import com.pearl.backend.medical.AppointmentDto;
import com.pearl.backend.medical.AppointmentRequest;
import com.pearl.backend.entities.Appointment;
import com.pearl.backend.entities.Users;
import com.pearl.backend.medical.DoctorDTO;
import com.pearl.backend.medical.UserDto;
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
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        List<DoctorDTO> doctors = userRepository.findByRole("DOCTOR").stream()
                .map(user -> new DoctorDTO(
                        user.getId(),
                        user.getName(),
                        user.getHospital(),
                        user.getRole(),
                        user.getProfilePhoto()
                ))
                .toList();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/me/appointments")
    public ResponseEntity<List<AppointmentDto>> getMyAppointments() {
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

        List<AppointmentDto> result = appointments.stream().map(a -> new AppointmentDto(
                a.getId().toString(),
                new UserDto(a.getDoctor().getId().toString(), a.getDoctor().getName(), a.getDoctor().getHospital(), a.getDoctor().getProfilePhoto()),
                new UserDto(a.getPatient().getId().toString(), a.getPatient().getName(), null, a.getPatient().getProfilePhoto()),
                a.getAppointmentTime(),
                a.getDescription(),
                a.getStatus()
        )).toList();

        return ResponseEntity.ok(result);
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
                .status("Pending Confirmation")
                .build();

        appointmentRepository.save(appointment);
        return ResponseEntity.ok(appointment);
    }
}
