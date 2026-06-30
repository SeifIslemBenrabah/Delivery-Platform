package com.deliveryplatform.utilisateur.dto;

import com.deliveryplatform.utilisateur.model.Role;
import com.deliveryplatform.utilisateur.model.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private Role role;
    private String avatar;

    // Livreur
    private String cartNationalId;
    private String vehiculePapiers;
    private Boolean availability;
    private Double rating;
    private Double totalRevenu;
    private Double revenuRetire;
    private String carteBancaire;

    // Commerçant
    private String cartNational;
    private String commercantType;
    private Double revenuTotal;

    public static UserDto fromUser(User u) {
        return UserDto.builder()
                .userId(u.getUserId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .address(u.getAddress())
                .role(u.getRole())
                .avatar(u.getAvatar())
                .cartNationalId(u.getCartNationalId())
                .vehiculePapiers(u.getVehiculePapiers())
                .availability(u.getAvailability())
                .rating(u.getRating())
                .totalRevenu(u.getTotalRevenu())
                .revenuRetire(u.getRevenuRetire())
                .carteBancaire(u.getCarteBancaire())
                .cartNational(u.getCartNational())
                .commercantType(u.getCommercantType())
                .revenuTotal(u.getRevenuTotal())
                .build();
    }
}