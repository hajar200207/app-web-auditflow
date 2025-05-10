package com.auditflow.auditflow.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity

public class AuditEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String title;
    private String type;
    private String country;
    private String startTime;
    private String endTime;
    private String description;
    private boolean isHoliday;

    private String eventGroup;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User createdBy;
}


