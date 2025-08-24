/*
package com.auditflow.auditflow.repository;

import com.auditflow.auditflow.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCompanyId(Long companyId);

    List<Project> findByStatus(String status);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.company.id = :companyId")
    long countByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT p FROM Project p WHERE p.projectManager = :auditor")
    List<Project> findByProjectManager(@Param("auditor") String auditor);

    boolean existsByOpportunityId(Long opportunityId);
    long countByOpportunityStatus(String status);

    List<Project> findByProjectManagerContainingIgnoreCase(String auditor);
}
*/
package com.auditflow.auditflow.repository;

import com.auditflow.auditflow.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByCompanyId(Long companyId);

    long countByCompanyId(Long companyId);

    List<Project> findByAssignedAuditor(String assignedAuditor);

    @Query("SELECT COUNT(p) FROM Project p JOIN p.opportunity o WHERE o.status = :status")
    long countByOpportunityStatus(@Param("status") String status);

    @Query("SELECT p FROM Project p JOIN FETCH p.opportunity o JOIN FETCH p.company c WHERE c.id = :companyId AND o.status = 'done'")
    List<Project> findProjectsWithDoneOpportunityByCompany(@Param("companyId") Long companyId);

    @Query("SELECT p FROM Project p JOIN p.opportunity o WHERE o.id = :opportunityId")
    List<Project> findByOpportunityId(@Param("opportunityId") Long opportunityId);

    @Query("SELECT p FROM Project p JOIN p.opportunity o WHERE o.status = 'done'")
    List<Project> findAllProjectsWithDoneOpportunity();

    // Find projects by audit code
    List<Project> findByAuditCode(String auditCode);

    // Find projects by status
    List<Project> findByStatus(String status);

    // Find projects by stage type
    List<Project> findByStageType(String stageType);

    // Complex query to get audit stages summary for a company
    @Query("SELECT p.auditCode, p.stageType, p.status, COUNT(p) FROM Project p " +
            "JOIN p.opportunity o WHERE p.companyId = :companyId AND o.status = 'done' " +
            "GROUP BY p.auditCode, p.stageType, p.status")
    List<Object[]> getAuditStagesSummaryByCompany(@Param("companyId") Long companyId);
}