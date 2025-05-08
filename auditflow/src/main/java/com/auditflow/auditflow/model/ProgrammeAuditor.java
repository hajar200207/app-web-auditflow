package com.auditflow.auditflow.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class ProgrammeAuditor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date date;  // التاريخ ديال البرنامج

    @OneToMany(cascade = CascadeType.ALL)  // لائحة ديال المهام
    private List<Task> tasks;

    @OneToOne(cascade = CascadeType.ALL)  // ملاحظة واحدة مرتبطة بالبرنامج
    private NoteText note;

    // Getters & Setters (باش نقراو و نكتبو القيم ديال المتغيرات)
}
