package com.example.demo.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;
    

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
}