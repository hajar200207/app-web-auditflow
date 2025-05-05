package com.auditflow.auditflow.service;

import com.auditflow.auditflow.model.Role;
import com.auditflow.auditflow.model.User;
import com.auditflow.auditflow.repository.RoleRepository;
import com.auditflow.auditflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.auditflow.auditflow.dto.LoginRequest;
import com.auditflow.auditflow.dto.RegisterRequest;
import com.auditflow.auditflow.security.JwtUtils;

@Service
public class UserService {

    @Autowired private UserRepository userRepo;
    @Autowired private RoleRepository roleRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtils jwtUtils;

    public void register(RegisterRequest req) {
        if (userRepo.existsByUsername(req.username)) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(req.username);
        user.setEmail(req.email);
        user.setPassword(passwordEncoder.encode(req.password));

        Role role = roleRepo.findByName(req.role);
        user.getRoles().add(role);

        userRepo.save(user);
    }

    public String authenticate(LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.username, req.password));

        SecurityContextHolder.getContext().setAuthentication(auth);
        User user = userRepo.findByUsername(req.username).orElseThrow();
        return jwtUtils.generateToken(user);
    }
}
