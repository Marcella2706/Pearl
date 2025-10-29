package com.pearl.backend.controllers;

import com.pearl.backend.auth.EditProfileRequest;
import com.pearl.backend.auth.UserResponse;
import com.pearl.backend.entities.Users;
import com.pearl.backend.services.JwtService;
import com.pearl.backend.services.UpdateProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UpdateProfile updateProfileService;

    public UserController(UpdateProfile updateProfileService) {
        this.updateProfileService = updateProfileService;
    }

    @GetMapping("/current-user")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        try {
            Users user = getUser(authentication);
            UserResponse response = UserResponse.builder()
                    .name(user.getName())
                    .email(user.getEmail())
                    .profilePhoto(user.getProfilePhoto())
                    .build();
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private Users getUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof Users user) {
            return user;
        }

        throw new RuntimeException("Unexpected principal type: " + principal.getClass().getName());
    }

    @PutMapping("/update-profile")
    public ResponseEntity<Users> updateProfile(@RequestBody EditProfileRequest request) {
        Users updatedUser = updateProfileService.updateUserProfile(request);
        return ResponseEntity.ok(updatedUser);
    }
}
