package com.auditflow.auditflow.model;

import jakarta.persistence.*;

@Entity
public class NoteText {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    // Getters & Setters
}
