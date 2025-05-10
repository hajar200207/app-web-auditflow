package com.auditflow.auditflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String type;
    private String status;
    private String startDate;
    private String endDate;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
}
