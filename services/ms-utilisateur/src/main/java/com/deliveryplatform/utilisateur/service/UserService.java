package com.deliveryplatform.utilisateur.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.deliveryplatform.utilisateur.dto.UserDto;
import com.deliveryplatform.utilisateur.kafka.UserEventProducer;
import com.deliveryplatform.utilisateur.model.Role;
import com.deliveryplatform.utilisateur.model.User;
import com.deliveryplatform.utilisateur.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final Cloudinary cloudinary;
    private final UserEventProducer eventProducer;

    public UserDto getById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        return UserDto.fromUser(user);
    }

    @Transactional
    public UserDto updateProfile(String userId, Map<String, String> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        if (updates.containsKey("firstName")) user.setFirstName(updates.get("firstName"));
        if (updates.containsKey("lastName"))  user.setLastName(updates.get("lastName"));
        if (updates.containsKey("phone"))     user.setPhone(updates.get("phone"));
        if (updates.containsKey("address"))   user.setAddress(updates.get("address"));

        // Livreur
        if (updates.containsKey("carteBancaire")) user.setCarteBancaire(updates.get("carteBancaire"));
        if (updates.containsKey("availability"))  user.setAvailability(Boolean.parseBoolean(updates.get("availability")));

        // Commerçant
        if (updates.containsKey("commercantType")) user.setCommercantType(updates.get("commercantType"));

        return UserDto.fromUser(userRepository.save(user));
    }

    @Transactional
    public UserDto uploadAvatar(String userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        Map<?, ?> result = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap(
                "folder", "delivery-platform/avatars",
                "public_id", "avatar_" + userId,
                "overwrite", true,
                "resource_type", "image"
            )
        );
        user.setAvatar((String) result.get("secure_url"));
        return UserDto.fromUser(userRepository.save(user));
    }

    public List<UserDto> getLivreurs() {
        return userRepository.findAllByRole(Role.LIVREUR).stream()
                .map(UserDto::fromUser).toList();
    }

    public List<UserDto> getCommerçants() {
        return userRepository.findAllByRole(Role.COMMERCANT).stream()
                .map(UserDto::fromUser).toList();
    }

    @Transactional
    public UserDto verifyUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        eventProducer.publishUserVerified(userId, user.getRole().name());
        return UserDto.fromUser(user);
    }

    @Transactional
    public void updateRevenu(String userId, double amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        if (user.getRole() == Role.LIVREUR) {
            user.setTotalRevenu((user.getTotalRevenu() == null ? 0.0 : user.getTotalRevenu()) + amount);
        } else if (user.getRole() == Role.COMMERCANT) {
            user.setRevenuTotal((user.getRevenuTotal() == null ? 0.0 : user.getRevenuTotal()) + amount);
        }
        userRepository.save(user);
    }
}