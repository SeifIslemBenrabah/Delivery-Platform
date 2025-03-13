package com.example.demo.auth;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Role;
import com.example.demo.Entity.User;
import com.example.demo.Repo.UserRepo;
import com.example.demo.config.JwtService;

import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;
    private final UserRepo userRepo;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/oauth2/google")
    public ResponseEntity<AuthenticationResponse> googleLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // Check if user exists, if not, create them
        var user = userRepo.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .firstName("GoogleUser")
                    .lastName("")
                    .email(email)
                    .phone(0)
                    .address(null)
                    .password("") // Google users don't have local passwords
                    .role(Role.CLIENT)
                    .build();
            return userRepo.save(newUser);
        });

        // Generate JWT Token
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        return ResponseEntity.ok(AuthenticationResponse.builder().token(jwtToken).refreshToken(refreshToken).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            jwtService.invalidateToken(token);
            return ResponseEntity.ok("Logged out successfully");
        }
        return ResponseEntity.badRequest().body("Invalid token");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        String username = jwtService.extractUsername(refreshToken);

        if (username != null && jwtService.isTokenValid(refreshToken, userRepo.findByEmail(username).orElseThrow())) {
            var user = userRepo.findByEmail(username).orElseThrow();
            var newToken = jwtService.generateToken(user);
            return ResponseEntity.ok(AuthenticationResponse.builder().token(newToken).refreshToken(refreshToken).build());
        }
        return ResponseEntity.badRequest().body(null);
    }
}