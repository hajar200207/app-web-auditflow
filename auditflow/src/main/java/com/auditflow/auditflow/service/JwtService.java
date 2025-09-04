package com.auditflow.auditflow.service;

import com.auditflow.auditflow.model.User;
import com.auditflow.auditflow.repository.UserRepository;
import com.auditflow.auditflow.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    public String extractUsername(String token) {
        return jwtUtils.extractUsername(token);
    }

    public Long getUserIdFromToken(String token) {
        String username = jwtUtils.extractUsername(token);
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

