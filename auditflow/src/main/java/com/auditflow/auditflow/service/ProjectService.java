package com.auditflow.auditflow.service;

import com.auditflow.auditflow.model.Project;
import com.auditflow.auditflow.model.AuditOpportunity;
import com.auditflow.auditflow.repository.ProjectRepository;
import com.auditflow.auditflow.repository.AuditOpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private FileNameService fileNameService;


    @Autowired
    private AuditOpportunityRepository opportunityRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getProjectsByCompany(Long companyId) {
        return projectRepository.findByCompanyId(companyId);
    }

    public long getProjectCountByCompany(Long companyId) {
        return projectRepository.countByCompanyId(companyId);
    }

    public boolean deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Project> getProjectsByAuditor(String auditor) {
        return projectRepository.findByAssignedAuditor(auditor);
    }

    public long countProjectsByOpportunityStatusDone() {
        return projectRepository.countByOpportunityStatus("done");
    }

    @Transactional
    public List<Project> createProjectsForCompletedOpportunity(Long opportunityId) {
        Optional<AuditOpportunity> opportunityOpt = opportunityRepository.findById(opportunityId);

        if (!opportunityOpt.isPresent()) {
            throw new RuntimeException("Opportunity not found with id: " + opportunityId);
        }

        AuditOpportunity opportunity = opportunityOpt.get();

        // Check if opportunity status is 'done'
        if (!"done".equalsIgnoreCase(opportunity.getStatus())) {
            throw new RuntimeException("Opportunity status must be 'done' to create projects");
        }

        List<Project> projects = new ArrayList<>();
        String[] auditCodes = {"M1", "S1", "S2", "M2"};

        for (String auditCode : auditCodes) {
            Project project = createProjectFromOpportunity(opportunity, auditCode);
            projects.add(projectRepository.save(project));
        }

        return projects;
    }

    private Project createProjectFromOpportunity(AuditOpportunity opportunity, String auditCode) {
        Project project = new Project();

        // Basic project information
        project.setOpportunityId(opportunity.getId());
        project.setCompanyId(opportunity.getCompany() != null ? opportunity.getCompany().getId() : null);
        project.setOpportunityName(opportunity.getOpportunityName());

        // Set audit code as project name
        project.setAuditCode(auditCode);

        // Set stage type based on audit code
        project.setStageType(getStageTypeFromAuditCode(auditCode));

        // Copy relevant information from opportunity
        project.setAssignedAuditor(getStringValue(opportunity, "assignedAuditor"));
        project.setAuditType(getDefaultAuditType());
        project.setQuotationDays(getDefaultQuotationDays(auditCode));
        project.setAssignedDays(getDefaultQuotationDays(auditCode));
        project.setWitnessAudit(false); // Default value
        project.setStatus("Assigned"); // Default status
        project.setCreatedDate(LocalDateTime.now());

        // Generate team leader info
        String assignedAuditor = getStringValue(opportunity, "assignedAuditor");
        project.setTeamLeader("Lead Auditor/Verifying Auditor - " + (assignedAuditor != null ? assignedAuditor : "TBD"));

        // Set audit team (can be customized based on business logic)
        project.setAuditTeam(project.getQuotationDays() + " day(s)");

        return project;
    }

    private String getStageTypeFromAuditCode(String auditCode) {
        switch (auditCode) {
            case "S1": return "Stage 1";
            case "S2": return "Stage 2";
            case "M1": return "Surveillance 1";
            case "M2": return "Surveillance 2";
            default: return "Unknown";
        }
    }

    private String getDefaultAuditType() {
        return "Onsite Audit";
    }

    private Integer getDefaultQuotationDays(String auditCode) {
        switch (auditCode) {
            case "M1": // Surveillance 1
            case "M2": // Surveillance 2
                return 1;
            case "S1": // Stage 1
                return 1; // Changed from 0.5 to 1 for integer compatibility
            case "S2": // Stage 2
                return 2;
            default:
                return 1;
        }
    }
    public Project createProjectFromOpportunity(AuditOpportunity opportunity) {
        Project project = new Project();
        project.setOpportunity(opportunity);
        project.setCompany(opportunity.getCompany());

        // Vous pouvez ajuster les champs suivants selon vos besoins
        project.setProjectName(opportunity.getOpportunityName());
        project.setStatus("ACTIVE");
        project.setStartDate(LocalDate.now());
        // Par exemple, expectedEndDate = 1 mois après le début
        project.setExpectedEndDate(LocalDate.now().plusMonths(1));
        project.setProjectManager(opportunity.getSalesRep()); // ou autre champ lié

        return projectRepository.save(project);
    }
    // Helper method to safely extract string values from opportunity
    private String getStringValue(AuditOpportunity opportunity, String fieldName) {
        try {
            switch (fieldName) {
                case "assignedAuditor":
                    return opportunity.getAssignedAuditor();
                case "standard":
                    return opportunity.getStandard();
                default:
                    return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    // Method to get projects with audit stages for display
    public List<Project> getProjectsWithAuditStagesByCompany(Long companyId) {
        // This will return projects that are created from opportunities with status 'done'
        return projectRepository.findProjectsWithDoneOpportunityByCompany(companyId);
    }

    // Update project
    public Project updateProject(Long id, Project projectDetails) {
        Optional<Project> projectOpt = projectRepository.findById(id);

        if (!projectOpt.isPresent()) {
            throw new RuntimeException("Project not found with id: " + id);
        }

        Project project = projectOpt.get();

        // Update fields
        if (projectDetails.getStatus() != null) {
            project.setStatus(projectDetails.getStatus());
        }
        if (projectDetails.getAuditPlanSentDate() != null) {
            project.setAuditPlanSentDate(projectDetails.getAuditPlanSentDate());
        }
        if (projectDetails.getAuditReportSentDate() != null) {
            project.setAuditReportSentDate(projectDetails.getAuditReportSentDate());
        }
        if (projectDetails.getHandedForReviewDate() != null) {
            project.setHandedForReviewDate(projectDetails.getHandedForReviewDate());
        }
        if (projectDetails.getSubmittedToCaDate() != null) {
            project.setSubmittedToCaDate(projectDetails.getSubmittedToCaDate());
        }
        if (projectDetails.getTentativeDates() != null) {
            project.setTentativeDates(projectDetails.getTentativeDates());
        }
        if (projectDetails.getConfirmedDates() != null) {
            project.setConfirmedDates(projectDetails.getConfirmedDates());
        }
        if (projectDetails.getReleaseDate() != null) {
            project.setReleaseDate(projectDetails.getReleaseDate());
        }
        if (projectDetails.getCertificateDetails() != null) {
            project.setCertificateDetails(projectDetails.getCertificateDetails());
        }
        if (projectDetails.getPaymentNotes() != null) {
            project.setPaymentNotes(projectDetails.getPaymentNotes());
        }

        project.setLastModified(LocalDateTime.now());

        return projectRepository.save(project);
    }

    public Project findById(Long id) {
        Optional<Project> project = projectRepository.findById(id);
        return project.orElse(null);
    }


}