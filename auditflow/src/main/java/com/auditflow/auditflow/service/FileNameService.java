package com.auditflow.auditflow.service;

import com.auditflow.auditflow.model.AuditOpportunity;
import com.auditflow.auditflow.repository.AuditOpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FileNameService {

    @Autowired
    private AuditOpportunityRepository auditOpportunityRepository;

    /**
     * Génère un code de fichier unique au format MA-{number}-{standard}
     * Le numéro commence à 10000 et s'incrémente pour chaque nouvelle opportunity "Done"
     */
    @Transactional
    public String generateFileCode(AuditOpportunity opportunity) {
        // Compter le nombre d'opportunities qui ont déjà un fileNumber (status "Done")
        long count = auditOpportunityRepository.countByFileNumberIsNotNull();

        // Le prochain numéro commence à 10000
        long nextNumber = 10000 + count;

        // Nettoyer le standard (supprimer espaces, caractères spéciaux)
        String standardCode = cleanStandardCode(opportunity.getStandard());

        // Format: MA-{number}-{standard}
        return String.format("MA-%d-%s", nextNumber, standardCode);
    }

    /**
     * Nettoie le code standard pour l'utiliser dans le nom de fichier
     */
    private String cleanStandardCode(String standard) {
        if (standard == null || standard.trim().isEmpty()) {
            return "STD"; // valeur par défaut
        }

        // Supprimer espaces, caractères spéciaux et convertir en majuscules
        return standard.trim()
                .replaceAll("[^a-zA-Z0-9]", "") // garder seulement lettres et chiffres
                .toUpperCase();
    }

    /**
     * Vérifie si un code de fichier existe déjà
     */
    public boolean fileCodeExists(String fileCode) {
        return auditOpportunityRepository.existsByFileNumber(fileCode);
    }

    /**
     * Génère le prochain numéro disponible
     */
    public long getNextFileNumber() {
        long count = auditOpportunityRepository.countByFileNumberIsNotNull();
        return 10000 + count;
    }
}