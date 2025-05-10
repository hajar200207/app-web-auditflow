package com.auditflow.auditflow.controller;

import com.auditflow.auditflow.model.Task;
import com.auditflow.auditflow.repository.TaskRepository;
import com.auditflow.auditflow.model.User;
import com.auditflow.auditflow.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepo;

    @Autowired
    private UserRepository userRepo;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepo.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        if (task.getAssignedTo() != null && task.getAssignedTo().getId() != null) {
            User user = userRepo.findById(task.getAssignedTo().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedTo(user);
        }
        return taskRepo.save(task);
    }
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepo.deleteById(id);
    }
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return taskRepo.findById(id).map(task -> {
            task.setName(updatedTask.getName());
            task.setDescription(updatedTask.getDescription());
            task.setType(updatedTask.getType());
            task.setStatus(updatedTask.getStatus());
            task.setStartDate(updatedTask.getStartDate());
            task.setEndDate(updatedTask.getEndDate());

            if (updatedTask.getAssignedTo() != null && updatedTask.getAssignedTo().getId() != null) {
                User user = userRepo.findById(updatedTask.getAssignedTo().getId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                task.setAssignedTo(user);
            }

            return taskRepo.save(task);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

}
