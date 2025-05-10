package com.auditflow.auditflow.security;

import com.auditflow.auditflow.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JWTAuthorizationFilter jwtAuthorizationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/programme-auditor/**").hasRole("ROLE_AUDITOR")
                        .requestMatchers(HttpMethod.GET, "/api/programme-auditor/**").hasAnyRole("ROLE_AUDITOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/tasks/**").hasAnyRole("ADMIN", "ROLE_AUDITOR")
                        .requestMatchers(HttpMethod.POST, "/api/tasks/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/calendar/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/calendar/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/users/").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/me").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/companies/**").hasAnyRole("ROLE_AUDITOR", "ROLE_ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/opportunities/**").hasAnyRole("ROLE_AUDITOR", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/opportunities/**").hasAnyRole("ROLE_AUDITOR", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/companies/**").hasAnyRole("ROLE_AUDITOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/opportunities/*/stage").hasRole("ROLE_ADMIN")
                        .anyRequest().authenticated()
                )

                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    GrantedAuthorityDefaults grantedAuthorityDefaults() {
        return new GrantedAuthorityDefaults("");
    }
}
