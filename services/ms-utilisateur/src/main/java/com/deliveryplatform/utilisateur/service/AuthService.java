package com.deliveryplatform.utilisateur.service;

import com.deliveryplatform.utilisateur.dto.*;
import com.deliveryplatform.utilisateur.kafka.UserEventProducer;
import com.deliveryplatform.utilisateur.model.Role;
import com.deliveryplatform.utilisateur.model.User;
import com.deliveryplatform.utilisateur.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserEventProducer eventProducer;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé");
        }

        User user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .address(req.getAddress())
                .role(req.getRole())
                // Livreur fields
                .cartNationalId(req.getCartNationalId())
                .vehiculePapiers(req.getVehiculePapiers())
                .carteBancaire(req.getCarteBancaire())
                // Commerçant fields
                .cartNational(req.getCartNational())
                .commercantType(req.getCommercantType())
                .build();

        userRepository.save(user);
        eventProducer.publishUserRegistered(user.getUserId(), user.getRole().name());

        String accessToken = jwtService.generateAccessToken(
            user.getUserId(), user.getEmail(), user.getRole().name()
        );
        String refreshToken = jwtService.generateRefreshToken(user.getUserId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserDto.fromUser(user))
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        String accessToken = jwtService.generateAccessToken(
            user.getUserId(), user.getEmail(), user.getRole().name()
        );
        String refreshToken = jwtService.generateRefreshToken(user.getUserId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserDto.fromUser(user))
                .build();
    }

    public AuthResponse refresh(String refreshToken) {
        String userId = jwtService.resolveRefreshToken(refreshToken);
        if (userId == null) {
            throw new IllegalArgumentException("Refresh token invalide ou expiré");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        // Rotate refresh token
        jwtService.deleteRefreshToken(refreshToken);
        String newRefreshToken = jwtService.generateRefreshToken(user.getUserId());
        String newAccessToken = jwtService.generateAccessToken(
            user.getUserId(), user.getEmail(), user.getRole().name()
        );

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(UserDto.fromUser(user))
                .build();
    }

    public void logout(String bearerToken, String refreshToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            jwtService.blacklistAccessToken(bearerToken.substring(7));
        }
        if (refreshToken != null) {
            jwtService.deleteRefreshToken(refreshToken);
        }
    }
}