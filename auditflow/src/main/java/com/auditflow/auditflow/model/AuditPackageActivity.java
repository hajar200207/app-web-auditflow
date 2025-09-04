package com.auditflow.auditflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "audit_package_activities")
public class AuditPackageActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "activity_type", nullable = false)
    private String activityType; // TEMPLATE_DOWNLOAD, FILE_UPLOAD, FILE_DOWNLOAD

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "stage_name")
    private String stageName;

    // Constructors
    public AuditPackageActivity() {
        this.timestamp = LocalDateTime.now();
    }

    public AuditPackageActivity(Long userId, String activityType, String fileName, String description) {
        this.userId = userId;
        this.activityType = activityType;
        this.fileName = fileName;
        this.description = description;
        this.timestamp = LocalDateTime.now();
    }

    public AuditPackageActivity(Long userId, String activityType, String fileName, String description,
                                Long projectId, String stageName) {
        this.userId = userId;
        this.activityType = activityType;
        this.fileName = fileName;
        this.description = description;
        this.projectId = projectId;
        this.stageName = stageName;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getStageName() {
        return stageName;
    }

    public void setStageName(String stageName) {
        this.stageName = stageName;
    }
}