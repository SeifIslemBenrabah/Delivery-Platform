package com.deliveryplatform.utilisateur.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    private final StringRedisTemplate redis;

    private SecretKey key() {
        byte[] bytes = Decoders.BASE64.decode(
            java.util.Base64.getEncoder().encodeToString(secret.getBytes())
        );
        return Keys.hmacShaKeyFor(bytes);
    }

    public String generateAccessToken(String userId, String email, String role) {
        String jti = UUID.randomUUID().toString();
        return Jwts.builder()
                .id(jti)
                .subject(userId)
                .claim("email", email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(key())
                .compact();
    }

    public String generateRefreshToken(String userId) {
        String token = UUID.randomUUID().toString();
        redis.opsForValue().set(
            "refresh:" + token, userId,
            refreshTokenExpiration, TimeUnit.MILLISECONDS
        );
        return token;
    }

    public Claims parseAccessToken(String token) {
        return Jwts.parser().verifyWith(key()).build()
                .parseSignedClaims(token).getPayload();
    }

    public String getUserIdFromAccessToken(String token) {
        return parseAccessToken(token).getSubject();
    }

    public boolean isAccessTokenValid(String token) {
        try {
            Claims claims = parseAccessToken(token);
            String jti = claims.getId();
            // Check if blacklisted
            return Boolean.FALSE.equals(redis.hasKey("blacklist:" + jti));
        } catch (JwtException e) {
            return false;
        }
    }

    public void blacklistAccessToken(String token) {
        try {
            Claims claims = parseAccessToken(token);
            long ttl = claims.getExpiration().getTime() - System.currentTimeMillis();
            if (ttl > 0) {
                redis.opsForValue().set(
                    "blacklist:" + claims.getId(), "1",
                    ttl, TimeUnit.MILLISECONDS
                );
            }
        } catch (JwtException ignored) {}
    }

    public String resolveRefreshToken(String refreshToken) {
        return redis.opsForValue().get("refresh:" + refreshToken);
    }

    public void deleteRefreshToken(String refreshToken) {
        redis.delete("refresh:" + refreshToken);
    }
}