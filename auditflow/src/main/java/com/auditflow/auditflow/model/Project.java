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


}