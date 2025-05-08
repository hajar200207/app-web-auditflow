package com.auditflow.auditflow.model;

import jakarta.persistence.*;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;  // وصف المهمة

    // Getters & Setters (باش نقراو و نكتبو القيم ديال المتغيرات)
}
