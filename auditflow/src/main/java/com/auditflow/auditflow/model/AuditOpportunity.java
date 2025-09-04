package com.auditflow.auditflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
public class AuditOpportunity {
    @Id
    @GeneratedValue
    private Long id;

    private String opportunityName;
    private String standard;
    private String certificationBody;
    private String workItemId;
    private String auditCode;
    private String assignedAuditor;
    private LocalDate auditExpectedDate;
    private LocalDate certificateExpiryDate;
    private int auditDays;
    private String status;  // e.g., "Lost", "In Progress", "Done"
    private String stage;
    private String salesRep;

    // Review step fields
    private boolean establishPrimaryContact;
    private boolean identifyPainPoints;
    private boolean determineBudget;
    private boolean confirmTimeline;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(nullable = false)
    private boolean reviewCompleted = false;
    private Instant reviewCompletedAt;

    // Potential Application fields
    private LocalDate applicationSentDate;
    private String scope;
    private String scopeExclusions;
    private Integer fteNumber;
    private Integer shiftCount;
    private String auditFrequency;
    private String sitesProcesses;
    private boolean imsApplication;
    private LocalDate targetAuditDate;
    private String mainLanguage;
    private String consultantRelation;
    private String trainingReferral;
    private String riskLevel;
    private String iafCategory;
    private String availableAuditors;
    private String legalRequirements;
    private boolean contractReviewRequested;
    private boolean contractReviewApproved;

    // File paths for potential application documents
    private String applicationFilePath;
    private String transferDocsPath;
    private String fqApplicationPath;
    private String certificationChangeFormPath;
    private String commercialRegistrationPath;
    private String fteCalculatorPath;
    private String contractReviewPath;
    private String approvedContractReviewPath;

    // Proposal fields
    @Column(nullable = false)
    private boolean proposalTableShown = false;

    @Column(nullable = false)
    private boolean proposalTableLocked = false;

    @Column(name = "proposal_payment_terms")
    private String proposalPaymentTerms;

    @Column(name = "proposal_number")
    private String proposalNumber;

    @Column(name = "proposal_date")
    private String proposalDate;

    @Column(name = "proposal_client_proposal")
    private String proposalClientProposal;

    @Column(name = "proposal_file_name")
    private String proposalFileName;

    @Column(name = "proposal_file_path")
    private String proposalFilePath;

    // Proposal stages data - stored as JSON in TEXT field
    @Column(columnDefinition = "TEXT")
    private String proposalStagesData;

    @Column(nullable = false)
    private boolean proposalCompleted = false;
    private Instant proposalCompletedAt;

    // Negotiation fields
    @Column(nullable = false)
    private boolean competitorsDefined = false;
    @Column(nullable = false)
    private boolean pricingIntelligence = false;
    @Column(nullable = false)
    private boolean changesInProposalDays = false;
    @Column(nullable = false)
    private boolean requestApprovalRevisedContract = false;
    @Column(nullable = false)
    private boolean reviseProposal = false;
    @Column(nullable = false)
    private boolean mergeRevisedProposal = false;
    @Column(nullable = false)
    private boolean clientFinalDecision = false;
    @Column(nullable = false)
    private boolean uploadRevisedContractReview = false;
    @Column(nullable = false)
    private boolean approveRevisedContractReview = false;
    @Column(nullable = false)
    private boolean attachRevisedProposal = false;
    @Column(nullable = false)
    private boolean requestQuotationChange = false;

    private Instant clientDecisionDate;
    private String revisedContractReviewPath;
    private String revisedContractReviewFileName;

    @Column(nullable = false)
    private boolean negotiationCompleted = false;
    private Instant negotiationCompletedAt;

    // CONTRACT PHASE FIELDS - Updated with all necessary fields
    @Column(name = "cert_lang")
    private String certLang; // Certificate languages

    @Column(name = "cert_validity")
    private String certValidity; // Certificate validity (1 or 3 years)

    @Column(name = "expected_date")
    private LocalDate expectedDate; // Expected audit date

    @Column(name = "prepare_welcome_letter", nullable = false)
    private boolean prepareWelcomeLetter = false; // Prepare welcome letter checkbox

    // Contract completion tracking
    @Column(nullable = false)
    private boolean contractCompleted = false;
    private Instant contractCompletedAt;

    // ========== CONTRACT DOCUMENT PATHS AND FILENAMES ==========

    // Contract Review Multistandard (required)
    @Column(name = "contract_review_multistandard_path")
    private String contractReviewMultistandardPath;
    @Column(name = "contract_review_multistandard_filename")
    private String contractReviewMultistandardFileName;

    // P14 DF22E Application for Certification (optional)
    @Column(name = "application_form_path")
    private String applicationFormPath;
    @Column(name = "application_form_filename")
    private String applicationFormFileName;

    // Signed Quotation (required)
    @Column(name = "signed_quotation_path")
    private String signedQuotationPath;
    @Column(name = "signed_quotation_filename")
    private String signedQuotationFileName;

    // Company Commercial Registration (optional)
    @Column(name = "registration_path")
    private String registrationPath;
    @Column(name = "registration_filename")
    private String registrationFileName;

    // Other Documents (optional)
    @Column(name = "other_docs_path")
    private String otherDocsPath;
    @Column(name = "other_docs_filename")
    private String otherDocsFileName;

    // Certification Decision (optional)
    @Column(name = "cert_decision_path")
    private String certDecisionPath;
    @Column(name = "cert_decision_filename")
    private String certDecisionFileName;

    // P15 DF25a Stage 1 Audit Plan (optional)
    @Column(name = "audit_plan_path")
    private String auditPlanPath;
    @Column(name = "audit_plan_filename")
    private String auditPlanFileName;

    // P14 DF24 Audit programme (required)
    @Column(name = "audit_program_path")
    private String auditProgramPath;
    @Column(name = "audit_program_filename")
    private String auditProgramFileName;

    // Keep existing fields for backward compatibility
    @Column(name = "contract_review_filename")
    private String contractReviewFileName;

    @Column(name = "application_file_name")
    private String applicationFileName;

    @Column(name = "commercial_registration_filename")
    private String commercialRegistrationFileName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOpportunityName() {
        return opportunityName;
    }

    public void setOpportunityName(String opportunityName) {
        this.opportunityName = opportunityName;
    }

    public String getStandard() {
        return standard;
    }

    public void setStandard(String standard) {
        this.standard = standard;
    }

    public String getCertificationBody() {
        return certificationBody;
    }

    public void setCertificationBody(String certificationBody) {
        this.certificationBody = certificationBody;
    }

    public String getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(String workItemId) {
        this.workItemId = workItemId;
    }

    public String getAuditCode() {
        return auditCode;
    }

    public void setAuditCode(String auditCode) {
        this.auditCode = auditCode;
    }

    public String getAssignedAuditor() {
        return assignedAuditor;
    }

    public void setAssignedAuditor(String assignedAuditor) {
        this.assignedAuditor = assignedAuditor;
    }

    public LocalDate getAuditExpectedDate() {
        return auditExpectedDate;
    }

    public void setAuditExpectedDate(LocalDate auditExpectedDate) {
        this.auditExpectedDate = auditExpectedDate;
    }

    public LocalDate getCertificateExpiryDate() {
        return certificateExpiryDate;
    }

    public void setCertificateExpiryDate(LocalDate certificateExpiryDate) {
        this.certificateExpiryDate = certificateExpiryDate;
    }

    public int getAuditDays() {
        return auditDays;
    }

    public void setAuditDays(int auditDays) {
        this.auditDays = auditDays;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getSalesRep() {
        return salesRep;
    }

    public void setSalesRep(String salesRep) {
        this.salesRep = salesRep;
    }

    public boolean isEstablishPrimaryContact() {
        return establishPrimaryContact;
    }

    public void setEstablishPrimaryContact(boolean establishPrimaryContact) {
        this.establishPrimaryContact = establishPrimaryContact;
    }

    public boolean isIdentifyPainPoints() {
        return identifyPainPoints;
    }

    public void setIdentifyPainPoints(boolean identifyPainPoints) {
        this.identifyPainPoints = identifyPainPoints;
    }

    public boolean isDetermineBudget() {
        return determineBudget;
    }

    public void setDetermineBudget(boolean determineBudget) {
        this.determineBudget = determineBudget;
    }

    public boolean isConfirmTimeline() {
        return confirmTimeline;
    }

    public void setConfirmTimeline(boolean confirmTimeline) {
        this.confirmTimeline = confirmTimeline;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public boolean isReviewCompleted() {
        return reviewCompleted;
    }

    public void setReviewCompleted(boolean reviewCompleted) {
        this.reviewCompleted = reviewCompleted;
    }

    public Instant getReviewCompletedAt() {
        return reviewCompletedAt;
    }

    public void setReviewCompletedAt(Instant reviewCompletedAt) {
        this.reviewCompletedAt = reviewCompletedAt;
    }

    public LocalDate getApplicationSentDate() {
        return applicationSentDate;
    }

    public void setApplicationSentDate(LocalDate applicationSentDate) {
        this.applicationSentDate = applicationSentDate;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getScopeExclusions() {
        return scopeExclusions;
    }

    public void setScopeExclusions(String scopeExclusions) {
        this.scopeExclusions = scopeExclusions;
    }

    public Integer getFteNumber() {
        return fteNumber;
    }

    public void setFteNumber(Integer fteNumber) {
        this.fteNumber = fteNumber;
    }

    public Integer getShiftCount() {
        return shiftCount;
    }

    public void setShiftCount(Integer shiftCount) {
        this.shiftCount = shiftCount;
    }

    public String getAuditFrequency() {
        return auditFrequency;
    }

    public void setAuditFrequency(String auditFrequency) {
        this.auditFrequency = auditFrequency;
    }

    public String getSitesProcesses() {
        return sitesProcesses;
    }

    public void setSitesProcesses(String sitesProcesses) {
        this.sitesProcesses = sitesProcesses;
    }

    public boolean isImsApplication() {
        return imsApplication;
    }

    public void setImsApplication(boolean imsApplication) {
        this.imsApplication = imsApplication;
    }

    public LocalDate getTargetAuditDate() {
        return targetAuditDate;
    }

    public void setTargetAuditDate(LocalDate targetAuditDate) {
        this.targetAuditDate = targetAuditDate;
    }

    public String getMainLanguage() {
        return mainLanguage;
    }

    public void setMainLanguage(String mainLanguage) {
        this.mainLanguage = mainLanguage;
    }

    public String getConsultantRelation() {
        return consultantRelation;
    }

    public void setConsultantRelation(String consultantRelation) {
        this.consultantRelation = consultantRelation;
    }

    public String getTrainingReferral() {
        return trainingReferral;
    }

    public void setTrainingReferral(String trainingReferral) {
        this.trainingReferral = trainingReferral;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getIafCategory() {
        return iafCategory;
    }

    public void setIafCategory(String iafCategory) {
        this.iafCategory = iafCategory;
    }

    public String getAvailableAuditors() {
        return availableAuditors;
    }

    public void setAvailableAuditors(String availableAuditors) {
        this.availableAuditors = availableAuditors;
    }

    public String getLegalRequirements() {
        return legalRequirements;
    }

    public void setLegalRequirements(String legalRequirements) {
        this.legalRequirements = legalRequirements;
    }

    public boolean isContractReviewRequested() {
        return contractReviewRequested;
    }

    public void setContractReviewRequested(boolean contractReviewRequested) {
        this.contractReviewRequested = contractReviewRequested;
    }

    public boolean isContractReviewApproved() {
        return contractReviewApproved;
    }

    public void setContractReviewApproved(boolean contractReviewApproved) {
        this.contractReviewApproved = contractReviewApproved;
    }

    public String getApplicationFilePath() {
        return applicationFilePath;
    }

    public void setApplicationFilePath(String applicationFilePath) {
        this.applicationFilePath = applicationFilePath;
    }

    public String getTransferDocsPath() {
        return transferDocsPath;
    }

    public void setTransferDocsPath(String transferDocsPath) {
        this.transferDocsPath = transferDocsPath;
    }

    public String getFqApplicationPath() {
        return fqApplicationPath;
    }

    public void setFqApplicationPath(String fqApplicationPath) {
        this.fqApplicationPath = fqApplicationPath;
    }

    public String getCertificationChangeFormPath() {
        return certificationChangeFormPath;
    }

    public void setCertificationChangeFormPath(String certificationChangeFormPath) {
        this.certificationChangeFormPath = certificationChangeFormPath;
    }

    public String getCommercialRegistrationPath() {
        return commercialRegistrationPath;
    }

    public void setCommercialRegistrationPath(String commercialRegistrationPath) {
        this.commercialRegistrationPath = commercialRegistrationPath;
    }

    public String getFteCalculatorPath() {
        return fteCalculatorPath;
    }

    public void setFteCalculatorPath(String fteCalculatorPath) {
        this.fteCalculatorPath = fteCalculatorPath;
    }

    public String getContractReviewPath() {
        return contractReviewPath;
    }

    public void setContractReviewPath(String contractReviewPath) {
        this.contractReviewPath = contractReviewPath;
    }

    public String getApprovedContractReviewPath() {
        return approvedContractReviewPath;
    }

    public void setApprovedContractReviewPath(String approvedContractReviewPath) {
        this.approvedContractReviewPath = approvedContractReviewPath;
    }

    public boolean isProposalTableShown() {
        return proposalTableShown;
    }

    public void setProposalTableShown(boolean proposalTableShown) {
        this.proposalTableShown = proposalTableShown;
    }

    public boolean isProposalTableLocked() {
        return proposalTableLocked;
    }

    public void setProposalTableLocked(boolean proposalTableLocked) {
        this.proposalTableLocked = proposalTableLocked;
    }

    public String getProposalPaymentTerms() {
        return proposalPaymentTerms;
    }

    public void setProposalPaymentTerms(String proposalPaymentTerms) {
        this.proposalPaymentTerms = proposalPaymentTerms;
    }

    public String getProposalNumber() {
        return proposalNumber;
    }

    public void setProposalNumber(String proposalNumber) {
        this.proposalNumber = proposalNumber;
    }

    public String getProposalDate() {
        return proposalDate;
    }

    public void setProposalDate(String proposalDate) {
        this.proposalDate = proposalDate;
    }

    public String getProposalClientProposal() {
        return proposalClientProposal;
    }

    public void setProposalClientProposal(String proposalClientProposal) {
        this.proposalClientProposal = proposalClientProposal;
    }

    public String getProposalFileName() {
        return proposalFileName;
    }

    public void setProposalFileName(String proposalFileName) {
        this.proposalFileName = proposalFileName;
    }

    public String getProposalFilePath() {
        return proposalFilePath;
    }

    public void setProposalFilePath(String proposalFilePath) {
        this.proposalFilePath = proposalFilePath;
    }

    public String getProposalStagesData() {
        return proposalStagesData;
    }

    public void setProposalStagesData(String proposalStagesData) {
        this.proposalStagesData = proposalStagesData;
    }

    public boolean isProposalCompleted() {
        return proposalCompleted;
    }

    public void setProposalCompleted(boolean proposalCompleted) {
        this.proposalCompleted = proposalCompleted;
    }

    public Instant getProposalCompletedAt() {
        return proposalCompletedAt;
    }

    public void setProposalCompletedAt(Instant proposalCompletedAt) {
        this.proposalCompletedAt = proposalCompletedAt;
    }

    public boolean isCompetitorsDefined() {
        return competitorsDefined;
    }

    public void setCompetitorsDefined(boolean competitorsDefined) {
        this.competitorsDefined = competitorsDefined;
    }

    public boolean isPricingIntelligence() {
        return pricingIntelligence;
    }

    public void setPricingIntelligence(boolean pricingIntelligence) {
        this.pricingIntelligence = pricingIntelligence;
    }

    public boolean isChangesInProposalDays() {
        return changesInProposalDays;
    }

    public void setChangesInProposalDays(boolean changesInProposalDays) {
        this.changesInProposalDays = changesInProposalDays;
    }

    public boolean isRequestApprovalRevisedContract() {
        return requestApprovalRevisedContract;
    }

    public void setRequestApprovalRevisedContract(boolean requestApprovalRevisedContract) {
        this.requestApprovalRevisedContract = requestApprovalRevisedContract;
    }

    public boolean isReviseProposal() {
        return reviseProposal;
    }

    public void setReviseProposal(boolean reviseProposal) {
        this.reviseProposal = reviseProposal;
    }

    public boolean isMergeRevisedProposal() {
        return mergeRevisedProposal;
    }

    public void setMergeRevisedProposal(boolean mergeRevisedProposal) {
        this.mergeRevisedProposal = mergeRevisedProposal;
    }

    public boolean isClientFinalDecision() {
        return clientFinalDecision;
    }

    public void setClientFinalDecision(boolean clientFinalDecision) {
        this.clientFinalDecision = clientFinalDecision;
    }

    public boolean isUploadRevisedContractReview() {
        return uploadRevisedContractReview;
    }

    public void setUploadRevisedContractReview(boolean uploadRevisedContractReview) {
        this.uploadRevisedContractReview = uploadRevisedContractReview;
    }

    public boolean isApproveRevisedContractReview() {
        return approveRevisedContractReview;
    }

    public void setApproveRevisedContractReview(boolean approveRevisedContractReview) {
        this.approveRevisedContractReview = approveRevisedContractReview;
    }

    public boolean isAttachRevisedProposal() {
        return attachRevisedProposal;
    }

    public void setAttachRevisedProposal(boolean attachRevisedProposal) {
        this.attachRevisedProposal = attachRevisedProposal;
    }

    public boolean isRequestQuotationChange() {
        return requestQuotationChange;
    }

    public void setRequestQuotationChange(boolean requestQuotationChange) {
        this.requestQuotationChange = requestQuotationChange;
    }

    public Instant getClientDecisionDate() {
        return clientDecisionDate;
    }

    public void setClientDecisionDate(Instant clientDecisionDate) {
        this.clientDecisionDate = clientDecisionDate;
    }

    public String getRevisedContractReviewPath() {
        return revisedContractReviewPath;
    }

    public void setRevisedContractReviewPath(String revisedContractReviewPath) {
        this.revisedContractReviewPath = revisedContractReviewPath;
    }

    public String getRevisedContractReviewFileName() {
        return revisedContractReviewFileName;
    }

    public void setRevisedContractReviewFileName(String revisedContractReviewFileName) {
        this.revisedContractReviewFileName = revisedContractReviewFileName;
    }

    public boolean isNegotiationCompleted() {
        return negotiationCompleted;
    }

    public void setNegotiationCompleted(boolean negotiationCompleted) {
        this.negotiationCompleted = negotiationCompleted;
    }

    public Instant getNegotiationCompletedAt() {
        return negotiationCompletedAt;
    }

    public void setNegotiationCompletedAt(Instant negotiationCompletedAt) {
        this.negotiationCompletedAt = negotiationCompletedAt;
    }

    public String getCertLang() {
        return certLang;
    }

    public void setCertLang(String certLang) {
        this.certLang = certLang;
    }

    public String getCertValidity() {
        return certValidity;
    }

    public void setCertValidity(String certValidity) {
        this.certValidity = certValidity;
    }

    public LocalDate getExpectedDate() {
        return expectedDate;
    }

    public void setExpectedDate(LocalDate expectedDate) {
        this.expectedDate = expectedDate;
    }

    public boolean isPrepareWelcomeLetter() {
        return prepareWelcomeLetter;
    }

    public void setPrepareWelcomeLetter(boolean prepareWelcomeLetter) {
        this.prepareWelcomeLetter = prepareWelcomeLetter;
    }

    public boolean isContractCompleted() {
        return contractCompleted;
    }

    public void setContractCompleted(boolean contractCompleted) {
        this.contractCompleted = contractCompleted;
    }

    public Instant getContractCompletedAt() {
        return contractCompletedAt;
    }

    public void setContractCompletedAt(Instant contractCompletedAt) {
        this.contractCompletedAt = contractCompletedAt;
    }

    public String getContractReviewMultistandardPath() {
        return contractReviewMultistandardPath;
    }

    public void setContractReviewMultistandardPath(String contractReviewMultistandardPath) {
        this.contractReviewMultistandardPath = contractReviewMultistandardPath;
    }

    public String getContractReviewMultistandardFileName() {
        return contractReviewMultistandardFileName;
    }

    public void setContractReviewMultistandardFileName(String contractReviewMultistandardFileName) {
        this.contractReviewMultistandardFileName = contractReviewMultistandardFileName;
    }

    public String getApplicationFormPath() {
        return applicationFormPath;
    }

    public void setApplicationFormPath(String applicationFormPath) {
        this.applicationFormPath = applicationFormPath;
    }

    public String getApplicationFormFileName() {
        return applicationFormFileName;
    }

    public void setApplicationFormFileName(String applicationFormFileName) {
        this.applicationFormFileName = applicationFormFileName;
    }

    public String getSignedQuotationPath() {
        return signedQuotationPath;
    }

    public void setSignedQuotationPath(String signedQuotationPath) {
        this.signedQuotationPath = signedQuotationPath;
    }

    public String getSignedQuotationFileName() {
        return signedQuotationFileName;
    }

    public void setSignedQuotationFileName(String signedQuotationFileName) {
        this.signedQuotationFileName = signedQuotationFileName;
    }

    public String getRegistrationPath() {
        return registrationPath;
    }

    public void setRegistrationPath(String registrationPath) {
        this.registrationPath = registrationPath;
    }

    public String getRegistrationFileName() {
        return registrationFileName;
    }

    public void setRegistrationFileName(String registrationFileName) {
        this.registrationFileName = registrationFileName;
    }

    public String getOtherDocsPath() {
        return otherDocsPath;
    }

    public void setOtherDocsPath(String otherDocsPath) {
        this.otherDocsPath = otherDocsPath;
    }

    public String getOtherDocsFileName() {
        return otherDocsFileName;
    }

    public void setOtherDocsFileName(String otherDocsFileName) {
        this.otherDocsFileName = otherDocsFileName;
    }

    public String getCertDecisionPath() {
        return certDecisionPath;
    }

    public void setCertDecisionPath(String certDecisionPath) {
        this.certDecisionPath = certDecisionPath;
    }

    public String getCertDecisionFileName() {
        return certDecisionFileName;
    }

    public void setCertDecisionFileName(String certDecisionFileName) {
        this.certDecisionFileName = certDecisionFileName;
    }

    public String getAuditPlanPath() {
        return auditPlanPath;
    }

    public void setAuditPlanPath(String auditPlanPath) {
        this.auditPlanPath = auditPlanPath;
    }

    public String getAuditPlanFileName() {
        return auditPlanFileName;
    }

    public void setAuditPlanFileName(String auditPlanFileName) {
        this.auditPlanFileName = auditPlanFileName;
    }

    public String getAuditProgramPath() {
        return auditProgramPath;
    }

    public void setAuditProgramPath(String auditProgramPath) {
        this.auditProgramPath = auditProgramPath;
    }

    public String getAuditProgramFileName() {
        return auditProgramFileName;
    }

    public void setAuditProgramFileName(String auditProgramFileName) {
        this.auditProgramFileName = auditProgramFileName;
    }

    public String getContractReviewFileName() {
        return contractReviewFileName;
    }

    public void setContractReviewFileName(String contractReviewFileName) {
        this.contractReviewFileName = contractReviewFileName;
    }

    public String getApplicationFileName() {
        return applicationFileName;
    }

    public void setApplicationFileName(String applicationFileName) {
        this.applicationFileName = applicationFileName;
    }

    public String getCommercialRegistrationFileName() {
        return commercialRegistrationFileName;
    }

    public void setCommercialRegistrationFileName(String commercialRegistrationFileName) {
        this.commercialRegistrationFileName = commercialRegistrationFileName;
    }
    @Column(name = "release_date")
    private LocalDate releaseDate;

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }
    @Column(name = "file_number", unique = true)
    private String fileNumber;

    // Getter et Setter pour fileNumber
    public String getFileNumber() {
        return fileNumber;
    }

    public void setFileNumber(String fileNumber) {
        this.fileNumber = fileNumber;
    }
}