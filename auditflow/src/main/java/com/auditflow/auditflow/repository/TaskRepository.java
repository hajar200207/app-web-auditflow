package com.auditflow.auditflow.repository;

import com.auditflow.auditflow.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
