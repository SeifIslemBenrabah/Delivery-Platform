package com.example.demo.auth;

import com.example.demo.Entity.*;
import com.example.demo.Repo.UserRepo;
import com.example.demo.config.JwtService;
import lombok.RequiredArgsConstructor;

import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstname())
                .lastName(request.getLastname())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(null)
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(Role.CLIENT)) // Default role is CLIENT
                .build();
        userRepo.save(user);

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user); // Generate refresh token
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken) // Include refresh token in the response
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        var user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user); // Generate refresh token
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken) // Include refresh token in the response
                .build();
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        String username = jwtService.extractUsername(refreshToken);

        if (username != null && jwtService.isTokenValid(refreshToken, userRepo.findByEmail(username).orElseThrow())) {
            var user = userRepo.findByEmail(username).orElseThrow();
            var newToken = jwtService.generateToken(user);
            var newRefreshToken = jwtService.generateRefreshToken(user); // Generate new refresh token
            return AuthenticationResponse.builder()
                    .token(newToken)
                    .refreshToken(newRefreshToken) // Include new refresh token in the response
                    .build();
        }
        throw new RuntimeException("Invalid refresh token");
    }

    public void upgradeToLivreur(Long userId, LivreurRequest livreurRequest) {
        var user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var livreur = Livreur.builder()
                .cartNationalId(livreurRequest.getCartNationalId())
                .vehiclePapiers(livreurRequest.getVehiclePapiers())
                .user(user)
                .build();

        user.setLivreur(livreur);
        user.getRoles().add(Role.LIVREUR); // Add LIVREUR role
        userRepo.save(user);
    }

    public void upgradeToCommercant(Long userId, CommercantRequest commercantRequest) {
        var user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var commercant = Commercant.builder()
                .cartNationalId(commercantRequest.getCartNationalId())
                .type(commercantRequest.getType())
                .user(user)
                .build();

        user.setCommercant(commercant);
        user.getRoles().add(Role.COMMERCANT); // Add COMMERCANT role
        userRepo.save(user);
    }
}