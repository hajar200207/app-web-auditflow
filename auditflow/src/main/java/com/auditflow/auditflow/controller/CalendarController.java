package com.auditflow.auditflow.controller;

import com.auditflow.auditflow.model.AuditEvent;
import com.auditflow.auditflow.model.User;
import com.auditflow.auditflow.repository.AuditEventRepository;
import com.auditflow.auditflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private AuditEventRepository eventRepo;

    @Autowired
    private UserRepository userRepo;

    @GetMapping
    public List<AuditEvent> getAllEvents() {
        return eventRepo.findAll();
    }

    @PostMapping
    public AuditEvent createEvent(@RequestBody AuditEvent event) {
        if (event.getCreatedBy() != null && event.getCreatedBy().getId() != null) {
            User user = userRepo.findById(event.getCreatedBy().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            event.setCreatedBy(user);
        }
        return eventRepo.save(event);
    }
}
