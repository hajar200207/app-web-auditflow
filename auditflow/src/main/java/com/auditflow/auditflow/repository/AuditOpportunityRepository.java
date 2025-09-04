package com.auditflow.auditflow.repository;


import com.auditflow.auditflow.model.AuditOpportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuditOpportunityRepository extends JpaRepository<AuditOpportunity, Long> {
    List<AuditOpportunity> findByCompanyId(Long companyId);

    @Query(value = "SELECT file_number FROM audit_opportunity WHERE file_number IS NOT NULL ORDER BY id DESC LIMIT 1", nativeQuery = true)
    String findLastFileNumber();






    long countByAuditCodeIsNotNull();

    boolean existsByAuditCode(String auditCode);


    @Query("SELECT o FROM AuditOpportunity o WHERE o.auditCode IS NOT NULL ORDER BY o.id DESC")
    List<AuditOpportunity> findAllWithAuditCodeOrderByIdDesc();



    long countByFileNumberIsNotNull();

    /**
     * Vérifie si un fileNumber existe déjà
     */
    boolean existsByFileNumber(String fileNumber);

    /**
     * Trouve la dernière opportunité avec un fileNumber pour déterminer le prochain numéro
     */
    @Query("SELECT o FROM AuditOpportunity o WHERE o.fileNumber IS NOT NULL ORDER BY o.id DESC")
    List<AuditOpportunity> findAllWithFileNumberOrderByIdDesc();

    /**
     * Trouve toutes les opportunités avec status "Done"
     */
    List<AuditOpportunity> findByStatus(String status);


    /**
     * Count opportunities that have a file number (completed opportunities)
     */


    /**
     * Check if a file number already exists
     */


    /**
     * Find completed opportunities by company and status with file number
     */
    @Query("SELECT o FROM AuditOpportunity o WHERE o.company.id = :companyId AND o.status = :status AND o.fileNumber IS NOT NULL")
    List<AuditOpportunity> findByCompanyIdAndStatusAndFileNumberIsNotNull(
            @Param("companyId") Long companyId,
            @Param("status") String status
    );

    /**
     * Find all completed opportunities with file number by status
     */
    List<AuditOpportunity> findByStatusAndFileNumberIsNotNull(String status);

    /**
     * Find completed opportunities by company ID (for the frontend table)
     */
    @Query("SELECT o FROM AuditOpportunity o WHERE o.company.id = :companyId AND o.fileNumber IS NOT NULL ORDER BY o.releaseDate DESC")
    List<AuditOpportunity> findCompletedOpportunitiesByCompanyId(@Param("companyId") Long companyId);

    List<AuditOpportunity> findByStatusIgnoreCase(String status);
}
