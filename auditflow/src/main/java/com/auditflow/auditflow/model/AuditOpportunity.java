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
}