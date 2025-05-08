package com.auditflow.auditflow.model;

import java.util.HashSet;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;


@Getter
@Setter
@Entity
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;
    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<>();

}
