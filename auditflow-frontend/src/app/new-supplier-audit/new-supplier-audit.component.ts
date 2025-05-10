// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
//
// @Component({
//   selector: 'app-new-supplier-audit',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './new-supplier-audit.component.html',
//   styleUrls: ['./new-supplier-audit.component.css']
// })
// export class NewSupplierAuditComponent {
//   @Input() companyId!: number;
//   @Output() auditCreated = new EventEmitter<void>();
//
//   audit = {
//     opportunityName: '',
//     standard: '',
//     certificationBody: '',
//     workItemId: '',
//     auditCode: '',
//     assignedAuditor: '',
//     auditExpectedDate: '',
//     certificateExpiryDate: '',
//     auditDays: 0,
//     company: { id: 0 }
//   };
//
//   standards: string[] = [
//     'ISO 9001:2015', 'ISO 14001:2015', 'OHSAS 18001:2007', 'HACCP/Codex HACCP 2003',
//     'ISO 22000:2005', 'ISO 22005:2007', 'FSSC 22000', 'BRC',
//     'ISO-IEC 20000-1:2011', 'ISO-IEC 27001:2013', 'LAW 9000',
//     'ISO 22301:2012', 'ISO-IEC 27017:2015', 'ISO/IEC 27018:2019',
//     'GMP ISO 22716:2007', 'ISO 45001:2018', 'ISO 37001:2016', 'ISO 21001:2018'
//   ];
//
//   certificationBodies: string[] = [
//     'SAI Global - Navision (Solar)', 'RoyalCert', 'Food Chain Certification', 'SMG',
//     'SAI Global - Compass - Lebanon Agent', 'UMB', 'SQS', 'BM Trada', 'AJA Registrars',
//     'Bureau Veritas', 'Intertek', 'TUVRheinland', 'AFAQ - AFNOR Certification',
//     'BQC Business Quality Certification', 'BSI', 'SAI Global - Others',
//     'National Quality Assurance (nqa)', 'AXE', 'SGS', 'Eurofins', 'BNQ', 'SIS CERT',
//     'QSC-QUALITY STAR CB CHINA', 'DAS Certification', 'TUV Austria', 'SNR',
//     'Bureau of Accreditation Vietnam', 'BQSR', 'MS Certification Services', 'NSF',
//     'AIB International', 'QSI', 'SMG Food', 'Global Industry Services',
//     'American Petroleum Institute', 'RVA Netherland', 'MMS Global', 'KSA', 'CR',
//     'TAV', 'DNV Business Assurance Italy S.r.l.', 'BQB Cert'
//   ];
//
//   auditCodes: string[] = [
//     'GAP Assessment', 'Back-to-Back', 'Stage 1', 'Stage 2', 'M1', 'S1', 'M2',
//     'S2', 'M3', 'RR', 'Special Audit'
//   ];
//
//   auditors: string[] = [
//     'HOANG LUAT PHAN', 'Aaron Wolfe', 'Aasim Khan Orakzai', 'Abbas Zein',
//     'Abdul Majid Haddad', 'Abdul Rahman', 'Abdul Rauf', 'Abhishek VenuGopal',
//     'Abir Bassam', 'AbouBikr Sahli'
//   ];
//
//   constructor(private http: HttpClient) {}
//
//   submit() {
//     this.audit.company.id = this.companyId;
//
//     const token = localStorage.getItem('token');
//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
//
//     this.http.post('http://localhost:8080/api/opportunities', this.audit, { headers })
//         .subscribe(() => {
//           this.auditCreated.emit();
//         });
//   }
//
//   onClose() {
//     this.auditCreated.emit(); // You can optionally pass false if needed
//   }
// }
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-supplier-audit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-supplier-audit.component.html',
  styleUrls: ['./new-supplier-audit.component.css']
})
export class NewSupplierAuditComponent {
  @Input() companyId!: number;
  @Output() auditCreated = new EventEmitter<void>();

  audit = {
    opportunityName: '',
    standard: '',
    certificationBody: '',
    workItemId: '',
    auditCode: '',
    assignedAuditor: '',
    auditExpectedDate: '',
    certificateExpiryDate: '',
    auditDays: 0,
    company: { id: 0 },
    stage: ''
  };

  standards: string[] = [
    'ISO 9001:2015', 'ISO 14001:2015', 'OHSAS 18001:2007', 'HACCP/Codex HACCP 2003',
    'ISO 22000:2005', 'ISO 22005:2007', 'FSSC 22000', 'BRC',
    'ISO-IEC 20000-1:2011', 'ISO-IEC 27001:2013', 'LAW 9000',
    'ISO 22301:2012', 'ISO-IEC 27017:2015', 'ISO/IEC 27018:2019',
    'GMP ISO 22716:2007', 'ISO 45001:2018', 'ISO 37001:2016', 'ISO 21001:2018'
  ];

  certificationBodies: string[] = [
    'SAI Global - Navision (Solar)', 'RoyalCert', 'Food Chain Certification', 'SMG',
    'SAI Global - Compass - Lebanon Agent', 'UMB', 'SQS', 'BM Trada', 'AJA Registrars',
    'Bureau Veritas', 'Intertek', 'TUVRheinland', 'AFAQ - AFNOR Certification',
    'BQC Business Quality Certification', 'BSI', 'SAI Global - Others',
    'National Quality Assurance (nqa)', 'AXE', 'SGS', 'Eurofins', 'BNQ', 'SIS CERT',
    'QSC-QUALITY STAR CB CHINA', 'DAS Certification', 'TUV Austria', 'SNR',
    'Bureau of Accreditation Vietnam', 'BQSR', 'MS Certification Services', 'NSF',
    'AIB International', 'QSI', 'SMG Food', 'Global Industry Services',
    'American Petroleum Institute', 'RVA Netherland', 'MMS Global', 'KSA', 'CR',
    'TAV', 'DNV Business Assurance Italy S.r.l.', 'BQB Cert'
  ];

  auditCodes: string[] = [
    'GAP Assessment', 'Back-to-Back', 'Stage 1', 'Stage 2', 'M1', 'S1', 'M2',
    'S2', 'M3', 'RR', 'Special Audit'
  ];

  auditors: string[] = [
    'HOANG LUAT PHAN', 'Aaron Wolfe', 'Aasim Khan Orakzai', 'Abbas Zein',
    'Abdul Majid Haddad', 'Abdul Rahman', 'Abdul Rauf', 'Abhishek VenuGopal',
    'Abir Bassam', 'AbouBikr Sahli'
  ];

  constructor(private http: HttpClient) {}

  submit() {
    this.audit.company.id = this.companyId;
    this.audit.stage = 'Opportunity Review';

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post('http://localhost:8080/api/opportunities', this.audit, { headers })
        .subscribe(() => {
          this.auditCreated.emit();
        });
  }


  onClose() {
    this.auditCreated.emit(); // You can optionally pass false if needed
  }
}
