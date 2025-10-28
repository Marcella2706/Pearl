package com.pearl.backend.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditProfileRequest {
    private String name;
    private String email;
    private String profilePhoto;
    private String currentPassword;
    private String newPassword;
}

