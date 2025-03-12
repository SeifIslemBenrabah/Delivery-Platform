package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import com.example.demo.Entity.Role;
import com.example.demo.Entity.User;
import com.example.demo.Repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserRepo userRepo;
    private final JwtService jwtService;

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable()) // Disable CSRF if using a frontend
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/auth/**", "/oauth2/**").permitAll()
            
            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Change from STATELESS
        )
        .oauth2Login(oauth2 -> oauth2
            .authorizationEndpoint(auth -> auth
                .baseUri("/oauth2/authorization") // Ensure correct OAuth2 authorization endpoint
            )
            .userInfoEndpoint(userInfo -> userInfo
                .userService(oAuth2UserService()) // Handle Google user info
            )
            .successHandler((request, response, authentication) -> {
                OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                String email = oAuth2User.getAttribute("email");

                System.out.println("✅ Google Login Success - Email: " + email);

                var user = userRepo.findByEmail(email).orElseGet(() -> {
                    User newUser = User.builder()
                            .firstname(oAuth2User.getAttribute("given_name"))
                            .lastname(oAuth2User.getAttribute("family_name"))
                            .email(email)
                            .password("")
                            .role(Role.CLIENT)
                            .build();
                    return userRepo.save(newUser);
                });

                var jwtToken = jwtService.generateToken(user);
                System.out.println("🔹 JWT Token Generated: " + jwtToken);

                response.sendRedirect("http://localhost:8080/api/v1/demo-controller?token="+jwtToken);
            })
        );

    return http.build();
}

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService() {
        return new DefaultOAuth2UserService();
    }

}
