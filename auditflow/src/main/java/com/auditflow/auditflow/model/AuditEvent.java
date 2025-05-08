package com.auditflow.auditflow.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class AuditEvent {
    @Id @GeneratedValue
    private Long id;
    private String title;
    private String type; // e.g., Confirmed, Tentative
    private String country;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @ManyToOne
    private User createdBy;

}

