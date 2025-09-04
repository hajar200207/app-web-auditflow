package com.auditflow.auditflow.dto;

import lombok.Data;

@Data
class ChatTypingDto {
    private String userId;
    private String userName;
    private String userRole;
    private Boolean isTyping;
    private Long opportunityId;
    private Long timestamp;
}
