package com.deliveryplatform.utilisateur.dto;

import com.deliveryplatform.utilisateur.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String phone;
    private String address;

    @NotNull
    private Role role;

    // Livreur
    private String cartNationalId;
    private String vehiculePapiers;
    private String carteBancaire;

    // Commerçant
    private String cartNational;
    private String commercantType;
}