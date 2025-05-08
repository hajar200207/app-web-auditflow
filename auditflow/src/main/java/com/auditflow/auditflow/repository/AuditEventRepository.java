package com.auditflow.auditflow.repository;

import com.auditflow.auditflow.model.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    List<AuditEvent> findByCreatedByUsername(String username);
    List<AuditEvent> findByCountryAndType(String country, String type);
}

