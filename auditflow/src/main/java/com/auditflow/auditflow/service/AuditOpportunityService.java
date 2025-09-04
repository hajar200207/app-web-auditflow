package com.auditflow.auditflow.service;

import com.auditflow.auditflow.model.AuditOpportunity;
import com.auditflow.auditflow.repository.AuditOpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class AuditOpportunityService {

    @Autowired
    private AuditOpportunityRepository auditOpportunityRepository;

    @Autowired
    private FileNameService fileNameService;
    @Autowired
    private FileNumberGeneratorService fileNumberGeneratorService ;
    /**
     * Marque une opportunity comme "Done" et génère le file number
     */

    /**
     * Met à jour le status d'une opportunity et génère le file number si nécessaire
     */
    @Transactional
    public AuditOpportunity updateStatus(Long opportunityId, String newStatus) {
        AuditOpportunity opportunity = auditOpportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        String oldStatus = opportunity.getStatus();
        opportunity.setStatus(newStatus);

        // Si le nouveau status est "Done" et qu'il n'y avait pas de file number
        if ("Done".equalsIgnoreCase(newStatus) && opportunity.getFileNumber() == null) {
            String fileNumber = fileNameService.generateFileCode(opportunity);
            opportunity.setFileNumber(fileNumber);
            opportunity.setReleaseDate(LocalDate.now());
        }

        return auditOpportunityRepository.save(opportunity);
    }

    /**
     * Récupère toutes les opportunities "Done" avec file number pour une company
     */
    public List<AuditOpportunity> getCompletedOpportunitiesByCompany(Long companyId) {
        return auditOpportunityRepository.findByCompanyIdAndStatusAndFileNumberIsNotNull(
                companyId, "Done"
        );
    }

    /**
     * Récupère toutes les opportunities "Done" avec file number
     */
    public List<AuditOpportunity> getAllCompletedOpportunities() {
        return auditOpportunityRepository.findByStatusAndFileNumberIsNotNull("Done");
    }
    @Transactional
    public AuditOpportunity markAsDone(Long opportunityId) {
        AuditOpportunity opportunity = auditOpportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        // Générer le file number seulement si pas déjà généré
        if (opportunity.getFileNumber() == null) {
            String fileNumber = fileNumberGeneratorService.generateFileNumber(opportunity.getStandard());
            opportunity.setFileNumber(fileNumber);
            opportunity.setReleaseDate(LocalDate.now());
        }

        opportunity.setStatus("Done");

        return auditOpportunityRepository.save(opportunity);
    }


}