package com.auditflow.auditflow.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
class ChatSummaryDto {
    private Long opportunityId;
    private Long totalMessages;
    private Long unreadMessages;
    private ChatMessageDto lastMessage;
    private Map<Integer, Long> messagesPerStep;
    private List<ChatParticipantDto> participants;

}
