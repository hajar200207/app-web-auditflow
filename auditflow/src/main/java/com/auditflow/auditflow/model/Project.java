package com.auditflow.auditflow.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Getter
@Setter

@Entity
@Table(name = "projects")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "opportunity_id")
    private Long opportunityId;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "opportunity_name")
    private String opportunityName;

    // Audit stage fields
    @Column(name = "audit_code")
    private String auditCode;

    @Column(name = "stage_type")
    private String stageType;

    @Column(name = "team_leader")
    private String teamLeader;

    @Column(name = "audit_team")
    private String auditTeam;

    @Column(name = "witness_audit")
    private Boolean witnessAudit = false;

    @Column(name = "audit_type")
    private String auditType;

    @Column(name = "quotation_days")
    private Integer quotationDays;

    @Column(name = "assigned_days")
    private Integer assignedDays;

    // Date fields
    @Column(name = "audit_plan_sent_date")
    private LocalDateTime auditPlanSentDate;

    @Column(name = "audit_report_sent_date")
    private LocalDateTime auditReportSentDate;

    @Column(name = "handed_for_review_date")
    private LocalDateTime handedForReviewDate;

    @Column(name = "submitted_to_ca_date")
    private LocalDateTime submittedToCaDate;

    @Column(name = "tentative_dates")
    private String tentativeDates;

    @Column(name = "confirmed_dates")
    private String confirmedDates;

    @Column(name = "planned_dates")
    private String plannedDates;

    // Status and completion fields
    @Column(name = "status")
    private String status;

    @Column(name = "release_date")
    private LocalDateTime releaseDate;

    @Column(name = "certificate_details")
    private String certificateDetails;

    @Column(name = "payment_details")
    private String paymentDetails;

    @Column(name = "payment_notes")
    private String paymentNotes;

    // Audit metadata
    @Column(name = "assigned_auditor")
    private String assignedAuditor;

    // System fields
    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "last_modified")
    private LocalDateTime lastModified;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opportunity_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private AuditOpportunity opportunity;
    private String projectName;
    private LocalDate startDate;
    private LocalDate expectedEndDate;
    private LocalDate actualEndDate;
    private String projectManager;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Company company;

    // Constructors
    public Project() {
        this.createdDate = LocalDateTime.now();
        this.status = "Assigned";
        this.witnessAudit = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOpportunityId() {
        return opportunityId;
    }

    public void setOpportunityId(Long opportunityId) {
        this.opportunityId = opportunityId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getOpportunityName() {
        return opportunityName;
    }

    public void setOpportunityName(String opportunityName) {
        this.opportunityName = opportunityName;
    }

    public String getAuditCode() {
        return auditCode;
    }

    public void setAuditCode(String auditCode) {
        this.auditCode = auditCode;
    }

    public String getStageType() {
        return stageType;
    }

    public void setStageType(String stageType) {
        this.stageType = stageType;
    }

    public String getTeamLeader() {
        return teamLeader;
    }

    public void setTeamLeader(String teamLeader) {
        this.teamLeader = teamLeader;
    }

    public String getAuditTeam() {
        return auditTeam;
    }

    public void setAuditTeam(String auditTeam) {
        this.auditTeam = auditTeam;
    }

    public Boolean getWitnessAudit() {
        return witnessAudit;
    }

    public void setWitnessAudit(Boolean witnessAudit) {
        this.witnessAudit = witnessAudit;
    }

    public String getAuditType() {
        return auditType;
    }

    public void setAuditType(String auditType) {
        this.auditType = auditType;
    }

    public Integer getQuotationDays() {
        return quotationDays;
    }

    public void setQuotationDays(Integer quotationDays) {
        this.quotationDays = quotationDays;
    }

    public Integer getAssignedDays() {
        return assignedDays;
    }

    public void setAssignedDays(Integer assignedDays) {
        this.assignedDays = assignedDays;
    }

    public LocalDateTime getAuditPlanSentDate() {
        return auditPlanSentDate;
    }

    public void setAuditPlanSentDate(LocalDateTime auditPlanSentDate) {
        this.auditPlanSentDate = auditPlanSentDate;
    }

    public LocalDateTime getAuditReportSentDate() {
        return auditReportSentDate;
    }

    public void setAuditReportSentDate(LocalDateTime auditReportSentDate) {
        this.auditReportSentDate = auditReportSentDate;
    }

    public LocalDateTime getHandedForReviewDate() {
        return handedForReviewDate;
    }

    public void setHandedForReviewDate(LocalDateTime handedForReviewDate) {
        this.handedForReviewDate = handedForReviewDate;
    }

    public LocalDateTime getSubmittedToCaDate() {
        return submittedToCaDate;
    }

    public void setSubmittedToCaDate(LocalDateTime submittedToCaDate) {
        this.submittedToCaDate = submittedToCaDate;
    }

    public String getTentativeDates() {
        return tentativeDates;
    }

    public void setTentativeDates(String tentativeDates) {
        this.tentativeDates = tentativeDates;
    }

    public String getConfirmedDates() {
        return confirmedDates;
    }

    public void setConfirmedDates(String confirmedDates) {
        this.confirmedDates = confirmedDates;
    }

    public String getPlannedDates() {
        return plannedDates;
    }

    public void setPlannedDates(String plannedDates) {
        this.plannedDates = plannedDates;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDateTime releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getCertificateDetails() {
        return certificateDetails;
    }

    public void setCertificateDetails(String certificateDetails) {
        this.certificateDetails = certificateDetails;
    }

    public String getPaymentDetails() {
        return paymentDetails;
    }

    public void setPaymentDetails(String paymentDetails) {
        this.paymentDetails = paymentDetails;
    }

    public String getPaymentNotes() {
        return paymentNotes;
    }

    public void setPaymentNotes(String paymentNotes) {
        this.paymentNotes = paymentNotes;
    }

    public String getAssignedAuditor() {
        return assignedAuditor;
    }

    public void setAssignedAuditor(String assignedAuditor) {
        this.assignedAuditor = assignedAuditor;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }

    public AuditOpportunity getOpportunity() {
        return opportunity;
    }

    public void setOpportunity(AuditOpportunity opportunity) {
        this.opportunity = opportunity;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getExpectedEndDate() {
        return expectedEndDate;
    }

    public void setExpectedEndDate(LocalDate expectedEndDate) {
        this.expectedEndDate = expectedEndDate;
    }

    public LocalDate getActualEndDate() {
        return actualEndDate;
    }

    public void setActualEndDate(LocalDate actualEndDate) {
        this.actualEndDate = actualEndDate;
    }

    public String getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(String projectManager) {
        this.projectManager = projectManager;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

}