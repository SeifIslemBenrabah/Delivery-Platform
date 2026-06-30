package com.deliveryplatform.utilisateur.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    private String userId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;
    private String address;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String avatar;

    // ─── Livreur fields ───────────────────────────────────────────────────
    private String cartNationalId;
    private String vehiculePapiers;
    private Boolean availability;
    private Double rating;
    private Double totalRevenu;
    private Double revenuRetire;
    private String carteBancaire;

    // ─── Commerçant fields ────────────────────────────────────────────────
    private String cartNational;
    private String commercantType;
    private Double revenuTotal;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // ─── Pre-persist ──────────────────────────────────────────────────────
    @PrePersist
    public void prePersist() {
        if (userId == null) userId = UUID.randomUUID().toString();
        if (role == Role.LIVREUR) {
            if (availability == null) availability = true;
            if (rating == null) rating = 0.0;
            if (totalRevenu == null) totalRevenu = 0.0;
            if (revenuRetire == null) revenuRetire = 0.0;
        }
        if (role == Role.COMMERCANT) {
            if (revenuTotal == null) revenuTotal = 0.0;
        }
    }

    // ─── UserDetails ──────────────────────────────────────────────────────
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}