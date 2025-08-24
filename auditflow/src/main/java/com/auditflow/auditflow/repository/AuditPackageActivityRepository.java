package com.auditflow.auditflow.repository;

import com.auditflow.auditflow.model.AuditPackageActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditPackageActivityRepository extends JpaRepository<AuditPackageActivity, Long> {

    // Trouver toutes les activités d'un utilisateur, triées par date (plus récent en premier)
    List<AuditPackageActivity> findByUserIdOrderByTimestampDesc(Long userId);

    // Trouver toutes les activités, triées par date (plus récent en premier)
    List<AuditPackageActivity> findAllByOrderByTimestampDesc();

    // Trouver les activités par type
    List<AuditPackageActivity> findByActivityTypeOrderByTimestampDesc(String activityType);

    // Trouver les activités d'un utilisateur par type
    List<AuditPackageActivity> findByUserIdAndActivityTypeOrderByTimestampDesc(Long userId, String activityType);

    // Trouver les activités dans une période donnée
    @Query("SELECT a FROM AuditPackageActivity a WHERE a.timestamp BETWEEN :startDate AND :endDate ORDER BY a.timestamp DESC")
    List<AuditPackageActivity> findByTimestampBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Compter les téléchargements de template par utilisateur
    @Query("SELECT COUNT(a) FROM AuditPackageActivity a WHERE a.userId = :userId AND a.activityType = 'TEMPLATE_DOWNLOAD'")
    Long countTemplateDownloadsByUser(@Param("userId") Long userId);

    // Compter les uploads par utilisateur
    @Query("SELECT COUNT(a) FROM AuditPackageActivity a WHERE a.userId = :userId AND a.activityType = 'FILE_UPLOAD'")
    Long countFileUploadsByUser(@Param("userId") Long userId);
}