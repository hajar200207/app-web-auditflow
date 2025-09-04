package com.auditflow.auditflow.service;

import com.auditflow.auditflow.repository.AuditOpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileNumberGeneratorService {

    @Autowired
    private AuditOpportunityRepository opportunityRepository;

    public String generateFileNumber(String standard) {
        String lastFileNumber = opportunityRepository.findLastFileNumber();

        int nextNumber = 10000;
        if (lastFileNumber != null && lastFileNumber.startsWith("MA-")) {
            try {
                String[] parts = lastFileNumber.split("-");
                nextNumber = Integer.parseInt(parts[1]) + 1;
            } catch (Exception e) {
                nextNumber = 10000;
            }
        }

        String standardCode = (standard != null && !standard.isBlank())
                ? standard.replaceAll("[^a-zA-Z0-9]", "").toUpperCase()
                : "STD";

        return "MA-" + nextNumber + "-" + standardCode;
    }
}
