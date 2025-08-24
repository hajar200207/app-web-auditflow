package com.auditflow.auditflow.controller;

import com.auditflow.auditflow.model.AuditOpportunity;
import com.auditflow.auditflow.service.ProjectService;
import com.auditflow.auditflow.repository.AuditOpportunityRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/opportunities")
public class AuditOpportunityController {

    private final AuditOpportunityRepository repository;
    private final ProjectService projectService;

    public AuditOpportunityController(AuditOpportunityRepository repository, ProjectService projectService) {
        this.repository = repository;
        this.projectService = projectService;
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
            AuditOpportunity savedOpp = repository.save(opp);

            // Si status = Done, créer un projet lié automatiquement
            if ("Done".equalsIgnoreCase(savedOpp.getStatus())) {
                projectService.createProjectFromOpportunity(savedOpp);
            }

            return savedOpp;
        } else {
            throw new RuntimeException("Opportunity not found with id: " + id);
        }
    }

    @PutMapping("/{id}/review-steps")
    public AuditOpportunity updateReviewSteps(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> updatedFields) {

        return repository.findById(id)
                .map(opportunity -> {
                    updatedFields.forEach((field, value) -> {
                        boolean v = Boolean.TRUE.equals(value);
                        switch (field) {
                            case "establishPrimaryContact" -> opportunity.setEstablishPrimaryContact(v);
                            case "identifyPainPoints"      -> opportunity.setIdentifyPainPoints(v);
                            case "determineBudget"         -> opportunity.setDetermineBudget(v);
                            case "confirmTimeline"         -> opportunity.setConfirmTimeline(v);
                        }
                    });
                    return repository.save(opportunity);
                })
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
    }

    // Complete review step (all conditions must be true)
    @PostMapping("/{id}/review-steps/complete")
    public AuditOpportunity completeReview(@PathVariable Long id) {
        AuditOpportunity opportunity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        boolean allChecked =
                opportunity.isEstablishPrimaryContact() &&
                        opportunity.isIdentifyPainPoints() &&
                        opportunity.isDetermineBudget() &&
                        opportunity.isConfirmTimeline();

        if (!allChecked) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "All review checkboxes must be true before completing this step.");
        }

        opportunity.setReviewCompleted(true);
        opportunity.setReviewCompletedAt(Instant.now());

        // Optionally: advance stage
        if ("REVIEW".equalsIgnoreCase(opportunity.getStage())) {
            opportunity.setStage("CONTRACT");
        }

        return repository.save(opportunity);
    }
    @PutMapping("/{id}/potential-application")
    public AuditOpportunity updatePotentialApplication(
            @PathVariable Long id,
            @RequestParam Map<String, String> formData,
            @RequestParam(required = false) MultipartFile applicationFile,
            @RequestParam(required = false) MultipartFile transferDocsFile,
            @RequestParam(required = false) MultipartFile fqApplicationFile,
            @RequestParam(required = false) MultipartFile certificationChangeFile,
            @RequestParam(required = false) MultipartFile commercialRegistrationFile,
            @RequestParam(required = false) MultipartFile fteCalculatorFile,
            @RequestParam(required = false) MultipartFile contractReviewFile,
            @RequestParam(required = false) MultipartFile approvedContractReviewFile) {

        return repository.findById(id).map(opportunity -> {
            try {
                // Mapper les champs de texte
                if (formData.containsKey("applicationSentDate") && !formData.get("applicationSentDate").isEmpty()) {
                    opportunity.setApplicationSentDate(LocalDate.parse(formData.get("applicationSentDate")));
                }
                if (formData.containsKey("scope")) {
                    opportunity.setScope(formData.get("scope"));
                }
                if (formData.containsKey("scopeExclusions")) {
                    opportunity.setScopeExclusions(formData.get("scopeExclusions"));
                }
                if (formData.containsKey("fteNumber") && !formData.get("fteNumber").isEmpty()) {
                    opportunity.setFteNumber(Integer.parseInt(formData.get("fteNumber")));
                }
                if (formData.containsKey("shiftCount") && !formData.get("shiftCount").isEmpty()) {
                    opportunity.setShiftCount(Integer.parseInt(formData.get("shiftCount")));
                }
                if (formData.containsKey("auditFrequency")) {
                    opportunity.setAuditFrequency(formData.get("auditFrequency"));
                }
                if (formData.containsKey("sitesProcesses")) {
                    opportunity.setSitesProcesses(formData.get("sitesProcesses"));
                }
                if (formData.containsKey("imsApplication")) {
                    opportunity.setImsApplication(Boolean.parseBoolean(formData.get("imsApplication")));
                }
                if (formData.containsKey("targetAuditDate") && !formData.get("targetAuditDate").isEmpty()) {
                    opportunity.setTargetAuditDate(LocalDate.parse(formData.get("targetAuditDate")));
                }
                if (formData.containsKey("mainLanguage")) {
                    opportunity.setMainLanguage(formData.get("mainLanguage"));
                }
                if (formData.containsKey("consultantRelation")) {
                    opportunity.setConsultantRelation(formData.get("consultantRelation"));
                }
                if (formData.containsKey("trainingReferral")) {
                    opportunity.setTrainingReferral(formData.get("trainingReferral"));
                }
                if (formData.containsKey("riskLevel")) {
                    opportunity.setRiskLevel(formData.get("riskLevel"));
                }
                if (formData.containsKey("iafCategory")) {
                    opportunity.setIafCategory(formData.get("iafCategory"));
                }
                if (formData.containsKey("availableAuditors")) {
                    opportunity.setAvailableAuditors(formData.get("availableAuditors"));
                }
                if (formData.containsKey("legalRequirements")) {
                    opportunity.setLegalRequirements(formData.get("legalRequirements"));
                }
                if (formData.containsKey("contractReviewRequested")) {
                    opportunity.setContractReviewRequested(Boolean.parseBoolean(formData.get("contractReviewRequested")));
                }
                if (formData.containsKey("contractReviewApproved")) {
                    opportunity.setContractReviewApproved(Boolean.parseBoolean(formData.get("contractReviewApproved")));
                }

                // Traitement des fichiers - on stocke les chemins
                if (applicationFile != null && !applicationFile.isEmpty()) {
                    String filePath = saveFile(applicationFile, "application", opportunity.getId());
                    opportunity.setApplicationFilePath(filePath);
                }
                if (transferDocsFile != null && !transferDocsFile.isEmpty()) {
                    String filePath = saveFile(transferDocsFile, "transferDocs", opportunity.getId());
                    opportunity.setTransferDocsPath(filePath);
                }
                if (fqApplicationFile != null && !fqApplicationFile.isEmpty()) {
                    String filePath = saveFile(fqApplicationFile, "fqApplication", opportunity.getId());
                    opportunity.setFqApplicationPath(filePath);
                }
                if (certificationChangeFile != null && !certificationChangeFile.isEmpty()) {
                    String filePath = saveFile(certificationChangeFile, "certificationChange", opportunity.getId());
                    opportunity.setCertificationChangeFormPath(filePath);
                }
                if (commercialRegistrationFile != null && !commercialRegistrationFile.isEmpty()) {
                    String filePath = saveFile(commercialRegistrationFile, "commercialRegistration", opportunity.getId());
                    opportunity.setCommercialRegistrationPath(filePath);
                }
                if (fteCalculatorFile != null && !fteCalculatorFile.isEmpty()) {
                    String filePath = saveFile(fteCalculatorFile, "fteCalculator", opportunity.getId());
                    opportunity.setFteCalculatorPath(filePath);
                }
                if (contractReviewFile != null && !contractReviewFile.isEmpty()) {
                    String filePath = saveFile(contractReviewFile, "contractReview", opportunity.getId());
                    opportunity.setContractReviewPath(filePath);
                }
                if (approvedContractReviewFile != null && !approvedContractReviewFile.isEmpty()) {
                    String filePath = saveFile(approvedContractReviewFile, "approvedContractReview", opportunity.getId());
                    opportunity.setApprovedContractReviewPath(filePath);
                }

                return repository.save(opportunity);

            } catch (Exception e) {
                throw new RuntimeException("Error updating potential application: " + e.getMessage(), e);
            }
        }).orElseThrow(() -> new RuntimeException("Opportunity not found"));
    }

    private String saveFile(MultipartFile file, String fileType, Long opportunityId) {
        try {
            // Créer le répertoire s'il n'existe pas
            String uploadDir = "uploads/opportunities/" + opportunityId + "/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Générer un nom de fichier unique
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = fileType + "_" + System.currentTimeMillis() + extension;

            // Sauvegarder le fichier
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + e.getMessage(), e);
        }
    }

    // Alternative endpoint qui accepte JSON (pour les tests)
    @PutMapping("/{id}/potential-application-json")
    public AuditOpportunity updatePotentialApplicationJson(
            @PathVariable Long id,
            @RequestBody AuditOpportunity updated) {

        return repository.findById(id).map(opportunity -> {
            // Mapping des champs
            if (updated.getApplicationSentDate() != null) {
                opportunity.setApplicationSentDate(updated.getApplicationSentDate());
            }
            if (updated.getScope() != null) {
                opportunity.setScope(updated.getScope());
            }
            if (updated.getScopeExclusions() != null) {
                opportunity.setScopeExclusions(updated.getScopeExclusions());
            }
            if (updated.getFteNumber() != null) {
                opportunity.setFteNumber(updated.getFteNumber());
            }
            if (updated.getShiftCount() != null) {
                opportunity.setShiftCount(updated.getShiftCount());
            }
            if (updated.getAuditFrequency() != null) {
                opportunity.setAuditFrequency(updated.getAuditFrequency());
            }
            if (updated.getSitesProcesses() != null) {
                opportunity.setSitesProcesses(updated.getSitesProcesses());
            }
            opportunity.setImsApplication(updated.isImsApplication());
            if (updated.getTargetAuditDate() != null) {
                opportunity.setTargetAuditDate(updated.getTargetAuditDate());
            }
            if (updated.getMainLanguage() != null) {
                opportunity.setMainLanguage(updated.getMainLanguage());
            }
            if (updated.getConsultantRelation() != null) {
                opportunity.setConsultantRelation(updated.getConsultantRelation());
            }
            if (updated.getTrainingReferral() != null) {
                opportunity.setTrainingReferral(updated.getTrainingReferral());
            }
            if (updated.getRiskLevel() != null) {
                opportunity.setRiskLevel(updated.getRiskLevel());
            }
            if (updated.getIafCategory() != null) {
                opportunity.setIafCategory(updated.getIafCategory());
            }
            if (updated.getAvailableAuditors() != null) {
                opportunity.setAvailableAuditors(updated.getAvailableAuditors());
            }
            if (updated.getLegalRequirements() != null) {
                opportunity.setLegalRequirements(updated.getLegalRequirements());
            }
            opportunity.setContractReviewRequested(updated.isContractReviewRequested());
            opportunity.setContractReviewApproved(updated.isContractReviewApproved());

            return repository.save(opportunity);
        }).orElseThrow(() -> new RuntimeException("Opportunity not found"));
    }
    @PutMapping("/{id}/proposal")
    public AuditOpportunity updateProposal(
            @PathVariable Long id,
            @RequestParam Map<String, String> formData,
            @RequestParam(required = false) MultipartFile proposalFile) {

        return repository.findById(id).map(opportunity -> {
            try {
                // Mapper les champs de base
                if (formData.containsKey("proposalTableShown")) {
                    opportunity.setProposalTableShown(Boolean.parseBoolean(formData.get("proposalTableShown")));
                }
                if (formData.containsKey("proposalTableLocked")) {
                    opportunity.setProposalTableLocked(Boolean.parseBoolean(formData.get("proposalTableLocked")));
                }
                if (formData.containsKey("proposalPaymentTerms")) {
                    opportunity.setProposalPaymentTerms(formData.get("proposalPaymentTerms"));
                }
                if (formData.containsKey("proposalNumber")) {
                    opportunity.setProposalNumber(formData.get("proposalNumber"));
                }
                if (formData.containsKey("proposalDate")) {
                    opportunity.setProposalDate(formData.get("proposalDate"));
                }
                if (formData.containsKey("proposalClientProposal")) {
                    opportunity.setProposalClientProposal(formData.get("proposalClientProposal"));
                }
                if (formData.containsKey("proposalStagesData")) {
                    opportunity.setProposalStagesData(formData.get("proposalStagesData"));
                }

                // Traitement du fichier proposal
                if (proposalFile != null && !proposalFile.isEmpty()) {
                    String filePath = saveFile(proposalFile, "proposal", opportunity.getId());
                    opportunity.setProposalFilePath(filePath);
                    opportunity.setProposalFileName(proposalFile.getOriginalFilename());
                }

                return repository.save(opportunity);

            } catch (Exception e) {
                throw new RuntimeException("Error updating proposal: " + e.getMessage(), e);
            }
        }).orElseThrow(() -> new RuntimeException("Opportunity not found"));
    }

    @PutMapping("/{id}/proposal-json")
    public AuditOpportunity updateProposalJson(
            @PathVariable Long id,
            @RequestBody Map<String, Object> proposalData) {

        return repository.findById(id).map(opportunity -> {
            // Mapper les champs de base
            if (proposalData.containsKey("proposalTableShown")) {
                opportunity.setProposalTableShown((Boolean) proposalData.get("proposalTableShown"));
            }
            if (proposalData.containsKey("proposalTableLocked")) {
                opportunity.setProposalTableLocked((Boolean) proposalData.get("proposalTableLocked"));
            }
            if (proposalData.containsKey("proposalPaymentTerms")) {
                opportunity.setProposalPaymentTerms((String) proposalData.get("proposalPaymentTerms"));
            }
            if (proposalData.containsKey("proposalNumber")) {
                opportunity.setProposalNumber((String) proposalData.get("proposalNumber"));
            }
            if (proposalData.containsKey("proposalDate")) {
                opportunity.setProposalDate((String) proposalData.get("proposalDate"));
            }
            if (proposalData.containsKey("proposalClientProposal")) {
                opportunity.setProposalClientProposal((String) proposalData.get("proposalClientProposal"));
            }
            if (proposalData.containsKey("proposalStagesData")) {
                opportunity.setProposalStagesData((String) proposalData.get("proposalStagesData"));
            }
            if (proposalData.containsKey("proposalFileName")) {
                opportunity.setProposalFileName((String) proposalData.get("proposalFileName"));
            }

            return repository.save(opportunity);
        }).orElseThrow(() -> new RuntimeException("Opportunity not found"));
    }

    @PostMapping("/{id}/proposal/complete")
    public AuditOpportunity completeProposal(@PathVariable Long id) {
        AuditOpportunity opportunity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        boolean proposalValid =
                opportunity.isProposalTableShown() &&
                        opportunity.isProposalTableLocked() &&
                        opportunity.getProposalPaymentTerms() != null &&
                        opportunity.getProposalNumber() != null &&
                        opportunity.getProposalDate() != null &&
                        opportunity.getProposalClientProposal() != null;

        if (!proposalValid) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "All proposal fields must be completed before completing this step.");
        }

        opportunity.setProposalCompleted(true);
        opportunity.setProposalCompletedAt(Instant.now());

        // Optionally: advance stage
        if ("PROPOSAL".equalsIgnoreCase(opportunity.getStage())) {
            opportunity.setStage("NEGOTIATION");
        }

        return repository.save(opportunity);
    }
    @PutMapping("/{id}/negotiation-steps")
    public AuditOpportunity updateNegotiationSteps(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> updatedFields) {

        return repository.findById(id)
                .map(opportunity -> {
                    updatedFields.forEach((field, value) -> {
                        boolean v = Boolean.TRUE.equals(value);
                        switch (field) {
                            case "competitorsDefined" -> opportunity.setCompetitorsDefined(v);
                            case "pricingIntelligence" -> opportunity.setPricingIntelligence(v);
                            case "changesInProposalDays" -> opportunity.setChangesInProposalDays(v);
                            case "requestApprovalRevisedContract" -> opportunity.setRequestApprovalRevisedContract(v);
                            case "reviseProposal" -> opportunity.setReviseProposal(v);
                            case "mergeRevisedProposal" -> opportunity.setMergeRevisedProposal(v);
                            case "clientFinalDecision" -> {
                                opportunity.setClientFinalDecision(v);
                                if (v && opportunity.getClientDecisionDate() == null) {
                                    opportunity.setClientDecisionDate(Instant.now());
                                } else if (!v) {
                                    opportunity.setClientDecisionDate(null);
                                }
                            }
                            case "uploadRevisedContractReview" -> opportunity.setUploadRevisedContractReview(v);
                            case "approveRevisedContractReview" -> opportunity.setApproveRevisedContractReview(v);
                            case "attachRevisedProposal" -> opportunity.setAttachRevisedProposal(v);
                            case "requestQuotationChange" -> opportunity.setRequestQuotationChange(v);
                        }
                    });
                    return repository.save(opportunity);
                })
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
    }

    @PutMapping("/{id}/negotiation")
    public AuditOpportunity updateNegotiation(
            @PathVariable Long id,
            @RequestParam Map<String, String> formData,
            @RequestParam(required = false) MultipartFile revisedContractFile) {

        return repository.findById(id).map(opportunity -> {
            try {
                // Handle boolean checkboxes
                if (formData.containsKey("competitorsDefined")) {
                    opportunity.setCompetitorsDefined(Boolean.parseBoolean(formData.get("competitorsDefined")));
                }
                if (formData.containsKey("pricingIntelligence")) {
                    opportunity.setPricingIntelligence(Boolean.parseBoolean(formData.get("pricingIntelligence")));
                }
                if (formData.containsKey("changesInProposalDays")) {
                    opportunity.setChangesInProposalDays(Boolean.parseBoolean(formData.get("changesInProposalDays")));
                }
                if (formData.containsKey("requestApprovalRevisedContract")) {
                    opportunity.setRequestApprovalRevisedContract(Boolean.parseBoolean(formData.get("requestApprovalRevisedContract")));
                }
                if (formData.containsKey("reviseProposal")) {
                    opportunity.setReviseProposal(Boolean.parseBoolean(formData.get("reviseProposal")));
                }
                if (formData.containsKey("mergeRevisedProposal")) {
                    opportunity.setMergeRevisedProposal(Boolean.parseBoolean(formData.get("mergeRevisedProposal")));
                }
                if (formData.containsKey("clientFinalDecision")) {
                    boolean clientDecision = Boolean.parseBoolean(formData.get("clientFinalDecision"));
                    opportunity.setClientFinalDecision(clientDecision);
                    if (clientDecision && opportunity.getClientDecisionDate() == null) {
                        opportunity.setClientDecisionDate(Instant.now());
                    } else if (!clientDecision) {
                        opportunity.setClientDecisionDate(null);
                    }
                }
                if (formData.containsKey("uploadRevisedContractReview")) {
                    opportunity.setUploadRevisedContractReview(Boolean.parseBoolean(formData.get("uploadRevisedContractReview")));
                }
                if (formData.containsKey("approveRevisedContractReview")) {
                    opportunity.setApproveRevisedContractReview(Boolean.parseBoolean(formData.get("approveRevisedContractReview")));
                }
                if (formData.containsKey("attachRevisedProposal")) {
                    opportunity.setAttachRevisedProposal(Boolean.parseBoolean(formData.get("attachRevisedProposal")));
                }
                if (formData.containsKey("requestQuotationChange")) {
                    opportunity.setRequestQuotationChange(Boolean.parseBoolean(formData.get("requestQuotationChange")));
                }

                // Handle file upload
                if (revisedContractFile != null && !revisedContractFile.isEmpty()) {
                    String filePath = saveFile(revisedContractFile, "revisedContractReview", opportunity.getId());
                    opportunity.setRevisedContractReviewPath(filePath);
                    opportunity.setRevisedContractReviewFileName(revisedContractFile.getOriginalFilename());
                    opportunity.setUploadRevisedContractReview(true);
                }

                return repository.save(opportunity);

            } catch (Exception e) {
                throw new RuntimeException("Error updating negotiation: " + e.getMessage(), e);
            }
        }).orElseThrow(() -> new RuntimeException("Opportunity not found"));
    }

    @PostMapping("/{id}/negotiation/complete")
    public AuditOpportunity completeNegotiation(@PathVariable Long id) {
        AuditOpportunity opportunity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        // Check if client final decision is made (required)
        if (!opportunity.isClientFinalDecision()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Client Final Decision must be made before completing negotiation.");
        }

        opportunity.setNegotiationCompleted(true);
        opportunity.setNegotiationCompletedAt(Instant.now());

        // Optionally: advance stage
        if ("NEGOTIATION".equalsIgnoreCase(opportunity.getStage())) {
            opportunity.setStage("CLOSED_WON"); // or whatever your next stage is
        }

        return repository.save(opportunity);
    }

    @GetMapping("/{id}/negotiation/download-revised-contract")
    public ResponseEntity<Resource> downloadRevisedContract(@PathVariable Long id) {
        AuditOpportunity opportunity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        if (opportunity.getRevisedContractReviewPath() == null) {
            throw new RuntimeException("No revised contract file found");
        }

        try {
            Path filePath = Paths.get(opportunity.getRevisedContractReviewPath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + opportunity.getRevisedContractReviewFileName() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("File not found or not readable");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error downloading file: " + e.getMessage());
        }
    }
    // Add these endpoints to your AuditOpportunityController.java

    @PutMapping("/{id}/contract")
    public AuditOpportunity updateContract(
            @PathVariable Long id,
            @RequestParam Map<String, String> formData,
            @RequestParam(required = false) MultipartFile contractReviewFile,
            @RequestParam(required = false) MultipartFile applicationFormFile,
            @RequestParam(required = false) MultipartFile signedQuotationFile,
            @RequestParam(required = false) MultipartFile registrationFile,
            @RequestParam(required = false) MultipartFile otherDocsFile,
            @RequestParam(required = false) MultipartFile certDecisionFile,
            @RequestParam(required = false) MultipartFile auditPlanFile,
            @RequestParam(required = false) MultipartFile auditProgramFile) {

        return repository.findById(id).map(opportunity -> {
            try {
                // Update basic contract fields
                if (formData.containsKey("certLang")) {
                    opportunity.setCertLang(formData.get("certLang"));
                }
                if (formData.containsKey("certValidity")) {
                    opportunity.setCertValidity(formData.get("certValidity"));
                }
                if (formData.containsKey("expectedDate") && !formData.get("expectedDate").isEmpty()) {
                    opportunity.setExpectedDate(LocalDate.parse(formData.get("expectedDate")));
                }
                if (formData.containsKey("auditCode")) {
                    opportunity.setAuditCode(formData.get("auditCode"));
                }
                if (formData.containsKey("prepareWelcomeLetter")) {
                    opportunity.setPrepareWelcomeLetter(Boolean.parseBoolean(formData.get("prepareWelcomeLetter")));
                }

                // Handle document uploads
                Map<String, MultipartFile> files = new HashMap<>();
                files.put("contractReview", contractReviewFile);
                files.put("applicationForm", applicationFormFile);
                files.put("signedQuotation", signedQuotationFile);
                files.put("registration", registrationFile);
                files.put("otherDocs", otherDocsFile);
                files.put("certDecision", certDecisionFile);
                files.put("auditPlan", auditPlanFile);
                files.put("auditProgram", auditProgramFile);

                // Process each file upload
                for (Map.Entry<String, MultipartFile> entry : files.entrySet()) {
                    MultipartFile file = entry.getValue();
                    if (file != null && !file.isEmpty()) {
                        String filePath = saveFile(file, "contract_" + entry.getKey(), opportunity.getId());
                        // Store file path in appropriate field
                        setContractDocumentPath(opportunity, entry.getKey(), filePath);
                    }
                }

                return repository.save(opportunity);

            } catch (Exception e) {
                throw new RuntimeException("Error updating contract: " + e.getMessage(), e);
            }
        }).orElseThrow(() -> new RuntimeException("Opportunity not found"));
    }

    @PutMapping("/{id}/contract-json")
    public AuditOpportunity updateContractJson(
            @PathVariable Long id,
            @RequestBody Map<String, Object> contractData) {

        return repository.findById(id).map(opportunity -> {
            // Update basic contract fields
            if (contractData.containsKey("certLang")) {
                opportunity.setCertLang((String) contractData.get("certLang"));
            }
            if (contractData.containsKey("certValidity")) {
                opportunity.setCertValidity((String) contractData.get("certValidity"));
            }
            if (contractData.containsKey("expectedDate") && contractData.get("expectedDate") != null) {
                opportunity.setExpectedDate(LocalDate.parse((String) contractData.get("expectedDate")));
            }
            if (contractData.containsKey("auditCode")) {
                opportunity.setAuditCode((String) contractData.get("auditCode"));
            }
            if (contractData.containsKey("prepareWelcomeLetter")) {
                opportunity.setPrepareWelcomeLetter((Boolean) contractData.get("prepareWelcomeLetter"));
            }

            return repository.save(opportunity);
        }).orElseThrow(() -> new RuntimeException("Opportunity not found"));
    }

    @PostMapping("/{id}/contract/complete")
    public AuditOpportunity completeContract(@PathVariable Long id) {
        AuditOpportunity opportunity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        // Check if contract requirements are met
        boolean contractValid =
                opportunity.getExpectedDate() != null &&
                        opportunity.getAuditCode() != null &&
                        !opportunity.getAuditCode().isEmpty();

        if (!contractValid) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Required contract fields must be completed before completing this step.");
        }

        opportunity.setContractCompleted(true);
        opportunity.setContractCompletedAt(Instant.now());

        // Update stage to final completion
        if ("CONTRACT".equalsIgnoreCase(opportunity.getStage())) {
            opportunity.setStage("CLOSED_WON");
            opportunity.setStatus("Done");
        }

        AuditOpportunity savedOpportunity = repository.save(opportunity);

        // Create project from completed opportunity
        if ("Done".equalsIgnoreCase(savedOpportunity.getStatus())) {
            projectService.createProjectFromOpportunity(savedOpportunity);
        }

        return savedOpportunity;
    }

    // Helper method to set contract document paths
    private void setContractDocumentPath(AuditOpportunity opportunity, String documentType, String filePath) {
        switch (documentType) {
            case "contractReview" -> opportunity.setContractReviewPath(filePath);
            case "applicationForm" -> opportunity.setApplicationFilePath(filePath);
            case "signedQuotation" -> {
                // You might need to add this field to your entity
                // opportunity.setSignedQuotationPath(filePath);
            }
            case "registration" -> opportunity.setCommercialRegistrationPath(filePath);
            case "otherDocs" -> {
                // You might need to add this field to your entity
                // opportunity.setOtherDocsPath(filePath);
            }
            case "certDecision" -> {
                // You might need to add this field to your entity
                // opportunity.setCertDecisionPath(filePath);
            }
            case "auditPlan" -> {
                // You might need to add this field to your entity
                // opportunity.setAuditPlanPath(filePath);
            }
            case "auditProgram" -> {
                // You might need to add this field to your entity
                // opportunity.setAuditProgramPath(filePath);
            }
        }
    }
}


