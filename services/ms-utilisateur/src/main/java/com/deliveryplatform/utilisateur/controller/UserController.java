package com.deliveryplatform.utilisateur.controller;

import com.deliveryplatform.utilisateur.dto.UserDto;
import com.deliveryplatform.utilisateur.model.User;
import com.deliveryplatform.utilisateur.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserDto.fromUser(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMe(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> updates
    ) {
        return ResponseEntity.ok(userService.updateProfile(user.getUserId(), updates));
    }

    @PatchMapping("/me/avatar")
    public ResponseEntity<UserDto> uploadAvatar(
            @AuthenticationPrincipal User user,
            @RequestParam("avatar") MultipartFile file
    ) throws IOException {
        return ResponseEntity.ok(userService.uploadAvatar(user.getUserId(), file));
    }

    @GetMapping("/livreurs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getLivreurs() {
        return ResponseEntity.ok(userService.getLivreurs());
    }

    @GetMapping("/commercants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getCommerçants() {
        return ResponseEntity.ok(userService.getCommerçants());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getById(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getById(userId));
    }

    @PostMapping("/{userId}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> verifyUser(@PathVariable String userId) {
        return ResponseEntity.ok(userService.verifyUser(userId));
    }

    // Internal endpoint called by ms-paiement to update earnings
    @PatchMapping("/{userId}/revenu")
    public ResponseEntity<Void> updateRevenu(
            @PathVariable String userId,
            @RequestBody Map<String, Double> body
    ) {
        userService.updateRevenu(userId, body.getOrDefault("amount", 0.0));
        return ResponseEntity.noContent().build();
    }
}