package com.deliveryplatform.utilisateur.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishUserRegistered(String userId, String role) {
        Map<String, String> event = Map.of(
            "userId", userId,
            "role", role,
            "event", "USER_REGISTERED"
        );
        kafkaTemplate.send("user.registered", userId, event);
        log.info("Published user.registered for userId={}", userId);
    }

    public void publishUserVerified(String userId, String role) {
        Map<String, String> event = Map.of(
            "userId", userId,
            "role", role,
            "event", "USER_VERIFIED"
        );
        kafkaTemplate.send("user.verified", userId, event);
        log.info("Published user.verified for userId={}", userId);
    }
}