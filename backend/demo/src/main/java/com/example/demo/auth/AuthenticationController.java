package com.example.demo.auth;

import com.example.demo.config.JwtService;
import lombok.RequiredArgsConstructor;
import net.minidev.json.JSONArray;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;
    private final JwtService jwtService;
    

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/upgrade-to-livreur/{userId}")
    public ResponseEntity<String> upgradeToLivreur(
            @PathVariable Long userId,
            @RequestBody LivreurRequest livreurRequest) {
        service.upgradeToLivreur(userId, livreurRequest);
        return ResponseEntity.ok("User upgraded to Livreur successfully");
    }

    @PostMapping("/upgrade-to-commercant/{userId}")
    public ResponseEntity<String> upgradeToCommercant(
            @PathVariable Long userId,
            @RequestBody CommercantRequest commercantRequest) {
        service.upgradeToCommercant(userId, commercantRequest);
        return ResponseEntity.ok("User upgraded to Commerçant successfully");
    }

    @PostMapping("/create-boutique/{userId}")
    public ResponseEntity<String> createBoutique(@PathVariable Long userId, @RequestBody BoutiqueRequest boutiqueRequest) {
        service.createBoutique(userId, boutiqueRequest);
        return ResponseEntity.ok("Boutique created successfully");
    }

    @PostMapping("/set-working-hours/{userId}/{boutiqueId}")
    public ResponseEntity<String> setWorkingHours(@PathVariable Long userId, @PathVariable Long boutiqueId, @RequestBody List<HeuresTravailRequest> heuresTravailRequest)
    {
        service.setWorkingHours(userId,boutiqueId,heuresTravailRequest);
        return ResponseEntity.ok("Set working hours successfully");
    }

    @PostMapping("/verify-token")
    public ResponseEntity<?> verifyToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        try {
            if (!jwtService.isTokenValid(token, new DummyUser(jwtService.extractUsername(token)))) {

                return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Invalid or expired token"));
            }

            Set<String> roles = jwtService.extractRoles(token);
            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "username", jwtService.extractUsername(token),
                    "roles", roles
            ));
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Error verifying token"));
        }
    }

    static class DummyUser implements UserDetails {
        private final String username;

        public DummyUser(String username) {
            this.username = username;
        }

        @Override public String getUsername() { return username; }
        @Override public boolean isAccountNonExpired() { return true; }
        @Override public boolean isAccountNonLocked() { return true; }
        @Override public boolean isCredentialsNonExpired() { return true; }
        @Override public boolean isEnabled() { return true; }
        @Override public java.util.Collection<? extends GrantedAuthority> getAuthorities() { return java.util.List.of(); }
        @Override public String getPassword() { return ""; }
    }
}

