package com.example.demo.auth;

import com.example.demo.Entity.*;
import com.example.demo.Repo.JourRepo;
import com.example.demo.Repo.UserRepo;
import com.example.demo.Repo.boutiqueRepo;
import com.example.demo.Repo.commercentRepo;
import com.example.demo.Repo.heuresTravailRepo;
import com.example.demo.config.JwtService;
import com.example.demo.kafka.KafkaPublisher;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

import java.time.LocalTime;
import java.util.List;
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
    private final boutiqueRepo boutiqueRepo; 
    private final heuresTravailRepo heuresTravailRepo; 
    private final JourRepo jourRepo;
    private final commercentRepo commercentRepo;
    private final KafkaPublisher kafkaPublisher;
    private final ObjectMapper objectMapper;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstname())
                .lastName(request.getLastname())
                .email(request.getEmail())
                .phone(0)
                .address(null)
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(Role.CLIENT)) // Default role is CLIENT
                .build();
        //userRepo.save(user);

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user); 
        System.out.println(jwtToken);// Generate refresh token
        System.out.println(jwtService.extractRoles(jwtToken));
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
                if(livreurRequest.getRole() == "admin" ){
        var livreur = Livreur.builder()
                .cartNationalId(livreurRequest.getCartNationalId())
                .vehiclePapiers(livreurRequest.getVehiclePapiers())
                .user(user)
                .build();

        user.setLivreur(livreur);
        user.getRoles().add(Role.LIVREUR); //Add LIVREUR role
        userRepo.save(user);
        try {
            kafkaPublisher.sendMessage("livreur", objectMapper.writeValueAsString(livreur));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize Livreur object", e);
        }
        }



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
        try {
                kafkaPublisher.sendMessage("commercent", objectMapper.writeValueAsString(commercant));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize commercent object", e);
            }
        
        
    }
    public void setWorkingHours(Long userId, Long boutiqueId, List<HeuresTravailRequest> horaires) {
    Boutique boutique = boutiqueRepo.findById(boutiqueId)
        .orElseThrow(() -> new RuntimeException("Boutique not found"));

    if (!boutique.getCommercant().getId().equals(userId)) {
        throw new RuntimeException("You are not the owner of this boutique");
    }

    // Remove old horaires
    heuresTravailRepo.deleteByBoutique(boutique);

    // Add new horaires
    for (HeuresTravailRequest req : horaires) {
        Jour jour = jourRepo.findByNomJour(req.getJour())
            .orElseThrow(() -> new RuntimeException("Invalid jour: " + req.getJour()));

        HeuresTravail h = new HeuresTravail();
        h.setBoutique(boutique);
        h.setJour(jour);
        h.setHeureDebut(LocalTime.parse(req.getHeureDebut()));
        h.setHeureFin(LocalTime.parse(req.getHeureFin()));
        heuresTravailRepo.save(h);
    }
}
public Boutique createBoutique(Long userId, BoutiqueRequest boutiqueRequest) {
        // Fetch the user by userId
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Commercant commercant = commercentRepo.findByUser_Id(user.getId());
        // Create the boutique from the request
        Boutique boutique = new Boutique();
        boutique.setNom(boutiqueRequest.getNom());
        boutique.setAdresse(boutiqueRequest.getAdresse());
    
        // Link the boutique to the user (assuming a user has a list of boutiques)
        boutique.setCommercant(commercant);
    
        // Save the boutique
        return boutiqueRepo.save(boutique);
    }
    
}
