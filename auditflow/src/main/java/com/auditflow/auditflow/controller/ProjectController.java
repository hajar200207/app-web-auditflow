package com.auditflow.auditflow.controller;

import com.auditflow.auditflow.model.Project;
import com.auditflow.auditflow.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/company/{companyId}")
    public List<Project> getProjectsByCompany(@PathVariable Long companyId) {
        return projectService.getProjectsByCompany(companyId);
    }

    @GetMapping("/company/{companyId}/with-audit-stages")
    public List<Project> getProjectsWithAuditStagesByCompany(@PathVariable Long companyId) {
        return projectService.getProjectsWithAuditStagesByCompany(companyId);
    }

    @GetMapping("/count/{companyId}")
    public long getProjectCountByCompany(@PathVariable Long companyId) {
        return projectService.getProjectCountByCompany(companyId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        try {
            // You'll need to implement this method in the service
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        try {
            Project updatedProject = projectService.updateProject(id, projectDetails);
            return ResponseEntity.ok(updatedProject);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        boolean deleted = projectService.deleteProject(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/auditor/{auditor}")
    public List<Project> getProjectsByAuditor(@PathVariable String auditor) {
        return projectService.getProjectsByAuditor(auditor);
    }

    @GetMapping("/count/status-done")
    public long countProjectsByOpportunityStatusDone() {
        return projectService.countProjectsByOpportunityStatusDone();
    }

    @PostMapping("/opportunity/{opportunityId}/create-projects")
    public ResponseEntity<List<Project>> createProjectsForCompletedOpportunity(@PathVariable Long opportunityId) {
        try {
            List<Project> projects = projectService.createProjectsForCompletedOpportunity(opportunityId);
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get audit stages summary for a specific company
    @GetMapping("/company/{companyId}/audit-stages-summary")
    public ResponseEntity<List<Object[]>> getAuditStagesSummary(@PathVariable Long companyId) {
        // You'll need to implement this in the service
        return ResponseEntity.ok().build();
    }

    // Endpoint to create projects when opportunity status changes to 'done'
    @PostMapping("/auto-create-from-opportunity/{opportunityId}")
    public ResponseEntity<List<Project>> autoCreateProjectsFromOpportunity(@PathVariable Long opportunityId) {
        try {
            List<Project> projects = projectService.createProjectsForCompletedOpportunity(opportunityId);
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}