package com.auditflow.auditflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
public class ProgrammeAuditor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.DATE)
    private Date date;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Task> tasks;


    @OneToOne(cascade = CascadeType.ALL)
    private NoteText note;

    @ManyToOne
    @JoinColumn(name = "auditor_id")
    private User auditor;

}
