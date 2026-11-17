package com.example.backend_core.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Unauthorized: " + authException.getMessage() + "\"}");
                        }))
                .authorizeHttpRequests(auth -> auth
                        // Cho phép toàn bộ preflight OPTIONS requests đi qua tự do
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public routes
                        .requestMatchers("/", "/health", "/error", "/api/auth/**").permitAll()
                        
                        // Lessons: GET is public, POST/PUT/DELETE require ADMIN role
                        .requestMatchers(HttpMethod.GET, "/api/lessons/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/lessons/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/lessons/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/lessons/**").hasRole("ADMIN")

                        // Sentences: GET is public, write requires ADMIN role
                        .requestMatchers(HttpMethod.GET, "/api/sentences/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/sentences/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/sentences/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/sentences/**").hasRole("ADMIN")

                        // Topics: GET is public, write requires ADMIN role
                        .requestMatchers(HttpMethod.GET, "/api/topics/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/topics/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/topics/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/topics/**").hasRole("ADMIN")

                        // Vocabularies: GET is public, write requires ADMIN role
                        .requestMatchers(HttpMethod.GET, "/api/vocabularies/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/vocabularies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/vocabularies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/vocabularies/**").hasRole("ADMIN")

                        // User vocabulary — cần đăng nhập
                        .requestMatchers("/api/user-vocabulary/**").authenticated()

                        // Evaluation chấm phát âm & lịch sử — cần đăng nhập
                        .requestMatchers("/api/evaluate/**").authenticated()

                        // Upload avatar — cần đăng nhập
                        .requestMatchers(HttpMethod.POST, "/api/users/*/avatar").authenticated()

                        // Protected routes
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}