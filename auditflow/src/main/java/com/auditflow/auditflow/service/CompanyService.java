package com.auditflow.auditflow.service;

import com.auditflow.auditflow.model.Company;
import com.auditflow.auditflow.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }
    public Company saveCompany(Company company) {
        return companyRepository.save(company);
    }
    public Company getCompanyById(Long id) {
        return companyRepository.findById(id).orElse(null);
    }

}
