package com.auditflow.auditflow.service;

import com.auditflow.auditflow.model.AuditPackageActivity;
import com.auditflow.auditflow.repository.AuditPackageActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditPackageActivityService {

    @Autowired
    private AuditPackageActivityRepository activityRepository;

    public void logActivity(Long userId, String activityType, String fileName, String description) {
        AuditPackageActivity activity = new AuditPackageActivity(userId, activityType, fileName, description);
        activityRepository.save(activity);
    }

    public void logActivity(Long userId, String activityType, String fileName, String description,
                            Long projectId, String stageName) {
        AuditPackageActivity activity = new AuditPackageActivity(userId, activityType, fileName,
                description, projectId, stageName);
        activityRepository.save(activity);
    }

    public List<AuditPackageActivity> getUserHistory(Long userId) {
        return activityRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public List<AuditPackageActivity> getUserHistoryByProject(Long userId, Long projectId) {
        return activityRepository.findByUserIdAndProjectIdOrderByTimestampDesc(userId, projectId);
    }

    public List<AuditPackageActivity> getAllActivitiesForProject(Long projectId) {
        return activityRepository.findByProjectIdOrderByTimestampDesc(projectId);
    }

    public long getActivityCountByUser(Long userId) {
        return activityRepository.countByUserId(userId);
    }

    public List<AuditPackageActivity> getRecentActivities(int limit) {
        return activityRepository.findTopNByOrderByTimestampDesc(limit);
    }
}