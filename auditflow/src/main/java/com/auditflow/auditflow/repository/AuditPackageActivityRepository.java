package com.auditflow.auditflow.repository;

import com.auditflow.auditflow.model.AuditPackageActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditPackageActivityRepository extends JpaRepository<AuditPackageActivity, Long> {

    List<AuditPackageActivity> findByUserIdOrderByTimestampDesc(Long userId);

    List<AuditPackageActivity> findByUserIdAndProjectIdOrderByTimestampDesc(Long userId, Long projectId);

    List<AuditPackageActivity> findByProjectIdOrderByTimestampDesc(Long projectId);

    long countByUserId(Long userId);

    @Query("SELECT a FROM AuditPackageActivity a ORDER BY a.timestamp DESC")
    List<AuditPackageActivity> findAllOrderByTimestampDesc();

    @Query(value = "SELECT * FROM audit_package_activities ORDER BY timestamp DESC LIMIT :limit", nativeQuery = true)
    List<AuditPackageActivity> findTopNByOrderByTimestampDesc(@Param("limit") int limit);

    List<AuditPackageActivity> findByActivityTypeOrderByTimestampDesc(String activityType);

    @Query("SELECT a FROM AuditPackageActivity a WHERE a.userId = :userId AND a.activityType = :activityType ORDER BY a.timestamp DESC")
    List<AuditPackageActivity> findByUserIdAndActivityTypeOrderByTimestampDesc(
            @Param("userId") Long userId,
            @Param("activityType") String activityType
    );
}