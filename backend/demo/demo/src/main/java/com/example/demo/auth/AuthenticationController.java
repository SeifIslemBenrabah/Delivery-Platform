package com.example.demo.auth;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Boutique;



@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;
    

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        AuthenticationResponse response = service.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
     @PostMapping("/api/{userId}/boutiques")
    public ResponseEntity<Boutique> addBoutique(
        @PathVariable Long userId,
        @RequestBody BoutiqueRequest boutiqueRequest) {
        Boutique boutique = service.createBoutique( userId,boutiqueRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(boutique);
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
   
    @PostMapping("/api/{userId}/boutiques/{boutiqueId}/horaires")
    public ResponseEntity<String> setWorkingHours(
            @PathVariable Long userId,
            @PathVariable Long boutiqueId,
            @RequestBody List<HeuresTravailRequest> horaires) {  
        service.setWorkingHours(userId ,boutiqueId, horaires); 
        return ResponseEntity.ok("Working hours updated successfully");
    }
    }