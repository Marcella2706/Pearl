package com.pearl.backend.medical;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDto {
    private String id;
    private String name;
    private String hospital;
    private String profilePhoto;
}
