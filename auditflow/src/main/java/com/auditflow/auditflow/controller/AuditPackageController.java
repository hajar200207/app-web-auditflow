package com.auditflow.auditflow.controller;

import com.auditflow.auditflow.model.AuditPackageActivity;
import com.auditflow.auditflow.model.Project;
import com.auditflow.auditflow.service.AuditPackageActivityService;
import com.auditflow.auditflow.service.DocumentGenerationService;
import com.auditflow.auditflow.service.JwtService;
import com.auditflow.auditflow.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/audit-package")
// Remove @CrossOrigin annotation - handle it globally instead
public class AuditPackageController {

    @Autowired
    private DocumentGenerationService documentGenerationService;

    @Autowired
    private AuditPackageActivityService activityService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private JwtService jwtService;

    private final String UPLOAD_DIR = "uploads/audit-packages/";

    @GetMapping("/template/{projectId}")
    public ResponseEntity<ByteArrayResource> downloadTemplate(
            @PathVariable Long projectId,
            @RequestParam(required = false) String stage,
            @RequestHeader("Authorization") String token) {

        try {
            // Extract user ID from JWT token
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtService.extractUsername(jwtToken);
            Long userId = jwtService.getUserIdFromToken(jwtToken);

            System.out.println("DEBUG: Processing template download request");
            System.out.println("DEBUG: Project ID: " + projectId);
            System.out.println("DEBUG: Stage: " + stage);
            System.out.println("DEBUG: Username: " + username);
            System.out.println("DEBUG: User ID: " + userId);

            // Validate project exists and user has access
            Project project = projectService.findById(projectId);
            if (project == null) {
                System.out.println("ERROR: Project not found with ID: " + projectId);
                return ResponseEntity.notFound().build();
            }

            System.out.println("DEBUG: Project found: " + project.getOpportunityName());

            // Generate document based on stage type
            byte[] documentBytes;
            String filename;
            String documentType;

            if (stage != null && stage.toLowerCase().contains("contract")) {
                documentBytes = documentGenerationService.generateContract(projectId, userId);
                filename = generateContractFilename(project, stage);
                documentType = "CONTRACT";
            } else {
                documentBytes = documentGenerationService.generateAuditReport(projectId, userId);
                filename = generateReportFilename(project, stage);
                documentType = "AUDIT_REPORT";
            }

            System.out.println("DEBUG: Generated " + documentType + " with " + documentBytes.length + " bytes");

            // Log the activity
            activityService.logActivity(userId, "TEMPLATE_DOWNLOAD", filename,
                    "Downloaded " + documentType + " template for project: " + project.getOpportunityName());

            // Prepare response
            ByteArrayResource resource = new ByteArrayResource(documentBytes);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(documentBytes.length)
                    .body(resource);

        } catch (Exception e) {
            System.out.println("ERROR in downloadTemplate: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/upload/{projectId}")
    public ResponseEntity<String> uploadFile(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String stage,
            @RequestHeader("Authorization") String token) {

        try {
            // Extract user ID from JWT token
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtService.extractUsername(jwtToken);
            Long userId = jwtService.getUserIdFromToken(jwtToken);

            System.out.println("DEBUG: Processing file upload");
            System.out.println("DEBUG: Project ID: " + projectId);
            System.out.println("DEBUG: Username: " + username);
            System.out.println("DEBUG: File name: " + file.getOriginalFilename());

            // Validate project exists
            Project project = projectService.findById(projectId);
            if (project == null) {
                return ResponseEntity.notFound().build();
            }

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload");
            }

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR + projectId);
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String uniqueFilename = "uploaded_" + timestamp + "_" + projectId + "_" +
                    (stage != null ? stage.replaceAll("[^a-zA-Z0-9]", "_") : "document") + fileExtension;

            // Save file
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("DEBUG: File saved to: " + filePath.toString());

            // Log the activity
            activityService.logActivity(userId, "FILE_UPLOAD", uniqueFilename,
                    "Uploaded modified document for project: " + project.getOpportunityName() +
                            (stage != null ? " (Stage: " + stage + ")" : ""));

            return ResponseEntity.ok(uniqueFilename);

        } catch (IOException e) {
            System.out.println("ERROR in uploadFile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not upload the file: " + e.getMessage());
        }
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<ByteArrayResource> downloadUploadedFile(
            @PathVariable String filename,
            @RequestHeader("Authorization") String token) {

        try {
            // Extract user ID from JWT token
            String jwtToken = token.replace("Bearer ", "");
            Long userId = jwtService.getUserIdFromToken(jwtToken);

            System.out.println("DEBUG: Processing file download for: " + filename);

            // Extract project ID from filename (assuming format contains projectId)
            String[] filenameParts = filename.split("_");
            Long projectId = null;
            for (String part : filenameParts) {
                try {
                    projectId = Long.parseLong(part);
                    break;
                } catch (NumberFormatException ignored) {
                    // Continue searching for project ID
                }
            }

            if (projectId == null) {
                System.out.println("ERROR: Could not extract project ID from filename: " + filename);
                return ResponseEntity.badRequest().build();
            }

            // Validate project exists
            Project project = projectService.findById(projectId);
            if (project == null) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = Paths.get(UPLOAD_DIR + projectId).resolve(filename);

            if (!Files.exists(filePath)) {
                System.out.println("ERROR: File not found: " + filePath.toString());
                return ResponseEntity.notFound().build();
            }

            byte[] fileBytes = Files.readAllBytes(filePath);
            ByteArrayResource resource = new ByteArrayResource(fileBytes);

            // Log the activity
            activityService.logActivity(userId, "FILE_DOWNLOAD", filename,
                    "Downloaded uploaded file for project: " + project.getOpportunityName());

            // Determine content type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(fileBytes.length)
                    .body(resource);

        } catch (IOException e) {
            System.out.println("ERROR in downloadUploadedFile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<AuditPackageActivity>> getUserHistory(
            @RequestHeader("Authorization") String token) {

        try {
            // Extract user ID from JWT token
            String jwtToken = token.replace("Bearer ", "");
            Long userId = jwtService.getUserIdFromToken(jwtToken);

            System.out.println("DEBUG: Loading history for user ID: " + userId);

            List<AuditPackageActivity> history = activityService.getUserHistory(userId);
            return ResponseEntity.ok(history);

        } catch (Exception e) {
            System.out.println("ERROR in getUserHistory: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/project/{projectId}/info")
    public ResponseEntity<Project> getProjectInfo(
            @PathVariable Long projectId,
            @RequestHeader("Authorization") String token) {

        try {
            // Validate token
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtService.extractUsername(jwtToken);
            Long userId = jwtService.getUserIdFromToken(jwtToken);

            System.out.println("DEBUG: Loading project info for ID: " + projectId);
            System.out.println("DEBUG: Requested by user: " + username + " (ID: " + userId + ")");

            Project project = projectService.findById(projectId);
            if (project == null) {
                System.out.println("ERROR: Project not found with ID: " + projectId);
                return ResponseEntity.notFound().build();
            }

            System.out.println("DEBUG: Project found: " + project.getOpportunityName());
            return ResponseEntity.ok(project);

        } catch (Exception e) {
            System.out.println("ERROR in getProjectInfo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private String generateReportFilename(Project project, String stage) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String stageName = stage != null ? stage.replaceAll("[^a-zA-Z0-9]", "_") : "report";
        return String.format("Audit_Report_%s_%s_%s.docx",
                project.getAuditCode(), stageName, timestamp);
    }

    private String generateContractFilename(Project project, String stage) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String stageName = stage != null ? stage.replaceAll("[^a-zA-Z0-9]", "_") : "contract";
        return String.format("Contract_%s_%s_%s.docx",
                project.getAuditCode(), stageName, timestamp);
    }
}