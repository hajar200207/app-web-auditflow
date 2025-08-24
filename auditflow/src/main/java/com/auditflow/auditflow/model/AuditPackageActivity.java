package com.auditflow.auditflow.model;



import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_package_activities")
public class AuditPackageActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "activity_type", nullable = false, length = 50)
    private String activityType; // TEMPLATE_DOWNLOAD, FILE_UPLOAD, FILE_DOWNLOAD

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    // Constructeurs
    public AuditPackageActivity() {}

    public AuditPackageActivity(Long userId, String activityType, String fileName, LocalDateTime timestamp, String description) {
        this.userId = userId;
        this.activityType = activityType;
        this.fileName = fileName;
        this.timestamp = timestamp;
        this.description = description;
    }

    // Getters et Setters
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

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    @Override
    public String toString() {
        return "AuditPackageActivity{" +
                "id=" + id +
                ", userId=" + userId +
                ", activityType='" + activityType + '\'' +
                ", fileName='" + fileName + '\'' +
                ", timestamp=" + timestamp +
                ", description='" + description + '\'' +
                '}';
    }
}