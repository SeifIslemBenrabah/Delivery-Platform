package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import com.example.demo.Entity.Role;
import com.example.demo.Entity.User;
import com.example.demo.Repo.UserRepo;

import lombok.RequiredArgsConstructor;

import java.util.Set;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserRepo userRepo;
    private final JwtService jwtService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll() // Allow auth endpoints
                .anyRequest().authenticated() // Secure all other endpoints
            )
            .exceptionHandling(exception -> exception
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    response.getWriter().write("Access Denied: You are not authorized to access this resource.");
                })
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Allow session for OAuth2 login
            )
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(auth -> auth
                    .baseUri("/oauth2/authorization") // OAuth2 authorization endpoint
                )
                .redirectionEndpoint(redirection -> redirection
                    .baseUri("/login/oauth2/code/*") // OAuth2 callback endpoint
                )
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(oAuth2UserService()) // Handle OAuth2 user info
                )
                .successHandler((request, response, authentication) -> {
                    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                    String email = oAuth2User.getAttribute("email");

                    System.out.println("✅ Google Login Success - Email: " + email);

                    var user = userRepo.findByEmail(email).orElseGet(() -> {
                        User newUser = User.builder()
                                .firstName(oAuth2User.getAttribute("given_name"))
                                .lastName(oAuth2User.getAttribute("family_name"))
                                .email(email)
                                .phone(0)
                                .address(null)
                                .password("")
                                .roles(Set.of(Role.CLIENT)) // Initialize roles as a Set
                                .build();
                        return userRepo.save(newUser);
                    });

                    var jwtToken = jwtService.generateToken(user);
                    System.out.println("🔹 JWT Token Generated: " + jwtToken);

                    // Redirect with JWT token
                    response.sendRedirect("myapp://login-success?token=" + jwtToken);

                })
            )
            .logout(logout -> logout
                .logoutUrl("/api/v1/auth/logout") // Logout endpoint
                .addLogoutHandler((LogoutHandler) (request, response, authentication) -> {
                    // Invalidate the token (you can add more logic here if needed)
                    String authHeader = request.getHeader("Authorization");
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);
                        jwtService.invalidateToken(token); // Invalidate the token
                    }
                })
                .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK)) // Return 200 on success
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter

        return http.build();
    }

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService() {
        return new DefaultOAuth2UserService();
    }
}