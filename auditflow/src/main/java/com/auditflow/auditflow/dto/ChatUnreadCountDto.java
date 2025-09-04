package com.auditflow.auditflow.dto;

import lombok.Data;

import java.util.Map;


import lombok.Data;
import java.util.Map;

@Data
public class ChatUnreadCountDto {
    private Long totalUnread;

    public Long getTotalUnread() {
        return totalUnread;
    }

    public void setTotalUnread(Long totalUnread) {
        this.totalUnread = totalUnread;
    }

    public Map<Integer, Long> getStepUnreadCounts() {
        return stepUnreadCounts;
    }

    public void setStepUnreadCounts(Map<Integer, Long> stepUnreadCounts) {
        this.stepUnreadCounts = stepUnreadCounts;
    }

    private Map<Integer, Long> stepUnreadCounts;
}

