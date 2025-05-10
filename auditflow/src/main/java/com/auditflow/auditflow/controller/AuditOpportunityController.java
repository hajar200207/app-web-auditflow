package com.auditflow.auditflow.controller;

import com.auditflow.auditflow.model.AuditOpportunity;
import com.auditflow.auditflow.repository.AuditOpportunityRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/opportunities")
public class AuditOpportunityController {

    private final AuditOpportunityRepository repository;

    public AuditOpportunityController(AuditOpportunityRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public AuditOpportunity create(@RequestBody AuditOpportunity opportunity) {
        return repository.save(opportunity);
    }

    @GetMapping("/count/{companyId}")
    public long countByCompany(@PathVariable Long companyId) {
        return repository.findByCompanyId(companyId).size();
    }

    @GetMapping
    public List<AuditOpportunity> getAll() {
        return repository.findAll();
    }

    @PutMapping("/{id}/stage")
    public AuditOpportunity updateStage(@PathVariable Long id, @RequestBody AuditOpportunity updated) {
        Optional<AuditOpportunity> oppOptional = repository.findById(id);
        if (oppOptional.isPresent()) {
            AuditOpportunity opp = oppOptional.get();
            opp.setStage(updated.getStage());
            opp.setStatus(updated.getStatus());
            return repository.save(opp);
        } else {
            throw new RuntimeException("Opportunity not found with id: " + id);
        }
    }
}
