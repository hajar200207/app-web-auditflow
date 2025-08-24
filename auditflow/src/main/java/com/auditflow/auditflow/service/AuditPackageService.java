package com.auditflow.auditflow.service;

import com.auditflow.auditflow.model.AuditPackageActivity;
import com.auditflow.auditflow.repository.AuditPackageActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditPackageService {

    @Autowired
    private AuditPackageActivityRepository auditPackageActivityRepository;

    public void recordTemplateDownload(Long userId, LocalDateTime timestamp) {
        AuditPackageActivity activity = new AuditPackageActivity();
        activity.setUserId(userId);
        activity.setActivityType("TEMPLATE_DOWNLOAD");
        activity.setFileName("template_certificate.docx");
        activity.setTimestamp(timestamp);
        activity.setDescription("Template téléchargé par l'auditeur");

        auditPackageActivityRepository.save(activity);
    }

    public void recordFileUpload(Long userId, String filename, LocalDateTime timestamp) {
        AuditPackageActivity activity = new AuditPackageActivity();
        activity.setUserId(userId);
        activity.setActivityType("FILE_UPLOAD");
        activity.setFileName(filename);
        activity.setTimestamp(timestamp);
        activity.setDescription("Fichier uploadé: " + filename);

        auditPackageActivityRepository.save(activity);
    }

    public void recordFileDownload(Long userId, String filename, LocalDateTime timestamp) {
        AuditPackageActivity activity = new AuditPackageActivity();
        activity.setUserId(userId);
        activity.setActivityType("FILE_DOWNLOAD");
        activity.setFileName(filename);
        activity.setTimestamp(timestamp);
        activity.setDescription("Fichier téléchargé: " + filename);

        auditPackageActivityRepository.save(activity);
    }

    public List<AuditPackageActivity> getUserHistory(Long userId) {
        return auditPackageActivityRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public List<AuditPackageActivity> getAllActivities() {
        return auditPackageActivityRepository.findAllByOrderByTimestampDesc();
    }
}
