package com.auditflow.auditflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

}

