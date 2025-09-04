package com.auditflow.auditflow.service;

import com.auditflow.auditflow.model.AuditOpportunity;
import com.auditflow.auditflow.model.Company;
import com.auditflow.auditflow.model.Project;
import com.auditflow.auditflow.model.User;
import com.auditflow.auditflow.repository.AuditOpportunityRepository;
import com.auditflow.auditflow.repository.CompanyRepository;
import com.auditflow.auditflow.repository.ProjectRepository;
import com.auditflow.auditflow.repository.UserRepository;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class DocumentGenerationService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AuditOpportunityRepository opportunityRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectService projectService;

    public byte[] generateAuditReport(Long projectId, Long userId) throws Exception {
        System.out.println("DEBUG: Starting audit report generation for project: " + projectId);

        // Get project details for the document
        Project project = projectService.findById(projectId);
        String projectName = project != null ? project.getOpportunityName() : "Unknown Project";
        String auditCode = project != null ? project.getAuditCode() : "N/A";

        // Check if template exists
        Resource templateResource = new ClassPathResource("templates/audit-report-template.docx");

        if (templateResource.exists()) {
            System.out.println("DEBUG: Using template file for audit report");
            return generateFromTemplate(templateResource, projectId, userId, project);
        } else {
            System.out.println("WARNING: Template not found, generating simple document");
            return generateSimpleAuditReport(project, projectId, userId);
        }
    }

    public byte[] generateContract(Long projectId, Long userId) throws Exception {
        System.out.println("DEBUG: Starting contract generation for project: " + projectId);

        Project project = projectService.findById(projectId);
        Resource templateResource = new ClassPathResource("templates/contract-template.docx");

        if (templateResource.exists()) {
            System.out.println("DEBUG: Using template file for contract");
            return generateFromTemplate(templateResource, projectId, userId, project);
        } else {
            System.out.println("WARNING: Contract template not found, generating simple document");
            return generateSimpleContract(project, projectId, userId);
        }
    }

    private byte[] generateFromTemplate(Resource templateResource, Long projectId, Long userId, Project project) throws Exception {
        try (InputStream templateStream = templateResource.getInputStream()) {
            XWPFDocument document = new XWPFDocument(templateStream);

            // Replace placeholders with actual data
            if (project != null) {
                replaceTextInDocument(document, "${PROJECT_NAME}", project.getOpportunityName());
                replaceTextInDocument(document, "${AUDIT_CODE}", project.getAuditCode());
                replaceTextInDocument(document, "${TEAM_LEADER}", project.getTeamLeader());
                replaceTextInDocument(document, "${AUDIT_TEAM}", project.getAuditTeam());
                replaceTextInDocument(document, "${STATUS}", project.getStatus());
                replaceTextInDocument(document, "${PROJECT_ID}", projectId.toString());
            }

            replaceTextInDocument(document, "${GENERATED_DATE}", new java.util.Date().toString());
            replaceTextInDocument(document, "${USER_ID}", userId.toString());

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.write(outputStream);
            document.close();

            System.out.println("DEBUG: Document generated from template, size: " + outputStream.size() + " bytes");
            return outputStream.toByteArray();
        }
    }

    private byte[] generateSimpleAuditReport(Project project, Long projectId, Long userId) throws Exception {
        XWPFDocument document = new XWPFDocument();

        // Create title
        XWPFParagraph titleParagraph = document.createParagraph();
        titleParagraph.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun titleRun = titleParagraph.createRun();
        titleRun.setText("AUDIT REPORT");
        titleRun.setBold(true);
        titleRun.setFontSize(18);

        document.createParagraph().createRun().setText("");

        if (project != null) {
            addInfoLine(document, "Project Name:", project.getOpportunityName());
            addInfoLine(document, "Audit Code:", project.getAuditCode());
            addInfoLine(document, "Team Leader:", project.getTeamLeader());
            addInfoLine(document, "Audit Team:", project.getAuditTeam());
            addInfoLine(document, "Status:", project.getStatus());
        }

        addInfoLine(document, "Project ID:", projectId.toString());
        addInfoLine(document, "Generated Date:", new java.util.Date().toString());
        addInfoLine(document, "Generated by User ID:", userId.toString());

        document.createParagraph().createRun().setText("");
        document.createParagraph().createRun().setText("This is an automatically generated audit report template.");
        document.createParagraph().createRun().setText("Please complete the audit findings and recommendations sections.");

        // Add sections
        addSection(document, "1. EXECUTIVE SUMMARY", "");
        addSection(document, "2. AUDIT SCOPE", "");
        addSection(document, "3. METHODOLOGY", "");
        addSection(document, "4. FINDINGS", "");
        addSection(document, "5. RECOMMENDATIONS", "");
        addSection(document, "6. CONCLUSION", "");

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        document.write(outputStream);
        document.close();

        System.out.println("DEBUG: Simple audit report generated, size: " + outputStream.size() + " bytes");
        return outputStream.toByteArray();
    }

    private byte[] generateSimpleContract(Project project, Long projectId, Long userId) throws Exception {
        XWPFDocument document = new XWPFDocument();

        // Create title
        XWPFParagraph titleParagraph = document.createParagraph();
        titleParagraph.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun titleRun = titleParagraph.createRun();
        titleRun.setText("AUDIT CONTRACT");
        titleRun.setBold(true);
        titleRun.setFontSize(18);

        document.createParagraph().createRun().setText("");

        if (project != null) {
            addInfoLine(document, "Project Name:", project.getOpportunityName());
            addInfoLine(document, "Audit Code:", project.getAuditCode());
            addInfoLine(document, "Team Leader:", project.getTeamLeader());
            addInfoLine(document, "Status:", project.getStatus());
        }

        addInfoLine(document, "Contract Date:", new java.util.Date().toString());

        document.createParagraph().createRun().setText("");
        document.createParagraph().createRun().setText("This is an automatically generated audit contract template.");

        // Add contract sections
        addSection(document, "1. PARTIES", "");
        addSection(document, "2. SCOPE OF WORK", "");
        addSection(document, "3. DELIVERABLES", "");
        addSection(document, "4. TIMELINE", "");
        addSection(document, "5. TERMS AND CONDITIONS", "");

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        document.write(outputStream);
        document.close();

        System.out.println("DEBUG: Simple contract generated, size: " + outputStream.size() + " bytes");
        return outputStream.toByteArray();
    }

    private void addInfoLine(XWPFDocument document, String label, String value) {
        XWPFParagraph paragraph = document.createParagraph();
        XWPFRun labelRun = paragraph.createRun();
        labelRun.setText(label + " ");
        labelRun.setBold(true);

        XWPFRun valueRun = paragraph.createRun();
        valueRun.setText(value != null ? value : "N/A");
    }

    private void addSection(XWPFDocument document, String title, String content) {
        document.createParagraph().createRun().setText("");

        XWPFParagraph sectionTitle = document.createParagraph();
        XWPFRun titleRun = sectionTitle.createRun();
        titleRun.setText(title);
        titleRun.setBold(true);
        titleRun.setFontSize(12);

        XWPFParagraph contentParagraph = document.createParagraph();
        contentParagraph.createRun().setText(content.isEmpty() ? "[Please complete this section]" : content);
    }

    private void replaceTextInDocument(XWPFDocument document, String placeholder, String replacement) {
        // Simple text replacement in paragraphs
        for (XWPFParagraph paragraph : document.getParagraphs()) {
            for (XWPFRun run : paragraph.getRuns()) {
                String text = run.getText(0);
                if (text != null && text.contains(placeholder)) {
                    text = text.replace(placeholder, replacement != null ? replacement : "");
                    run.setText(text, 0);
                }
            }
        }
    }
}