package com.auditflow.auditflow.controller;

import com.auditflow.auditflow.model.ProgrammeAuditor;
import com.auditflow.auditflow.model.User;
import com.auditflow.auditflow.repository.ProgrammeAuditorRepository;
import com.auditflow.auditflow.repository.UserRepository;
import com.auditflow.auditflow.service.ProgrammeAuditorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programme-auditor")
public class ProgrammeAuditorController {

    @Autowired
    private ProgrammeAuditorService programmeAuditorService;
    @Autowired
    private UserRepository userRepository;
@Autowired
private ProgrammeAuditorRepository programmeAuditorRepository;
    @GetMapping("/")
    public List<ProgrammeAuditor> getAll() {
        return programmeAuditorService.getAll();
    }

    @GetMapping("/{id}")
    public ProgrammeAuditor getById(@PathVariable Long id) {
        return programmeAuditorService.getById(id);
    }

    @PostMapping("/")
    public ResponseEntity<?> createProgramme(@RequestBody ProgrammeAuditor programme,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non authentifié");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        programme.setAuditor(user);
        ProgrammeAuditor saved = programmeAuditorRepository.save(programme);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public void deleteProgramme(@PathVariable Long id) {
        programmeAuditorService.delete(id);
    }
}