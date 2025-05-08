package com.auditflow.auditflow.repository;

import com.auditflow.auditflow.model.NoteText;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteTextRepository extends JpaRepository<NoteText, Long> {
}
