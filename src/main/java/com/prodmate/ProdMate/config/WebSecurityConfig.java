package com.prodmate.ProdMate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // CSRF korumasını devre dışı bırak
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/static/**").permitAll()// Bu endpointlere izin ver
                        .anyRequest().authenticated() // Diğer tüm endpointler kimlik doğrulama gerektirir
                );
        return http.build();
    }
}