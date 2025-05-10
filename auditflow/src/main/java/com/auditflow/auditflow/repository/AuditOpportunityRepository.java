package com.auditflow.auditflow.repository;


import com.auditflow.auditflow.model.AuditOpportunity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditOpportunityRepository extends JpaRepository<AuditOpportunity, Long> {
    List<AuditOpportunity> findByCompanyId(Long companyId);
}
