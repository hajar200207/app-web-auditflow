package com.auditflow.auditflow.controller;

import com.auditflow.auditflow.model.ProgrammeAuditor;
import com.auditflow.auditflow.service.ProgrammeAuditorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programme-auditor")
public class ProgrammeAuditorController {

    @Autowired
    private ProgrammeAuditorService programmeAuditorService;

    @GetMapping("/")
    public List<ProgrammeAuditor> getAll() {
        return programmeAuditorService.getAll();
    }

    @GetMapping("/{id}")
    public ProgrammeAuditor getById(@PathVariable Long id) {
        return programmeAuditorService.getById(id);
    }

    @PostMapping("/")
    public ProgrammeAuditor addProgramme(@RequestBody ProgrammeAuditor programmeAuditor) {
        return programmeAuditorService.save(programmeAuditor);
    }

    @DeleteMapping("/{id}")
    public void deleteProgramme(@PathVariable Long id) {
        programmeAuditorService.delete(id);
    }
}
