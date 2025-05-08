package com.auditflow.auditflow.service;

import com.auditflow.auditflow.model.ProgrammeAuditor;
import com.auditflow.auditflow.repository.ProgrammeAuditorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgrammeAuditorService {

    @Autowired
    private ProgrammeAuditorRepository programmeAuditorRepository;

    public List<ProgrammeAuditor> getAll() {
        return programmeAuditorRepository.findAll();
    }

    public ProgrammeAuditor getById(Long id) {
        return programmeAuditorRepository.findById(id).orElse(null);
    }

    public ProgrammeAuditor save(ProgrammeAuditor programmeAuditor) {
        return programmeAuditorRepository.save(programmeAuditor);
    }

    public void delete(Long id) {
        programmeAuditorRepository.deleteById(id);
    }
}
