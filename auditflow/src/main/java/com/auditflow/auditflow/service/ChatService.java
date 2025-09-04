package com.auditflow.auditflow.service;

import com.auditflow.auditflow.dto.ChatMessageDto;
import com.auditflow.auditflow.dto.ChatUnreadCountDto;
import com.auditflow.auditflow.model.ChatMessage;
import com.auditflow.auditflow.model.Project;
import com.auditflow.auditflow.model.Role;
import com.auditflow.auditflow.model.User;
import com.auditflow.auditflow.repository.ChatMessageRepository;
import com.auditflow.auditflow.repository.ProjectRepository;
import com.auditflow.auditflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ChatMessageDto> getMessages(Long opportunityId, Integer stepIndex) {
        List<ChatMessage> messages;

        if (stepIndex != null) {
            messages = chatMessageRepository.findByOpportunityIdAndStepIndexOrderByTimestampAsc(
                    opportunityId, stepIndex
            );
        } else {
            messages = chatMessageRepository.findByOpportunityIdOrderByTimestampAsc(opportunityId);
        }

        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ChatMessageDto saveMessage(ChatMessageDto messageDto) {
        ChatMessage message = convertToEntity(messageDto);

        // Generate unique message ID if not provided
        if (message.getMessageId() == null) {
            message.setMessageId(generateMessageId());
        }

        // Set timestamp if not provided
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }

        ChatMessage savedMessage = chatMessageRepository.save(message);
        return convertToDto(savedMessage);
    }

    public ChatUnreadCountDto getUnreadCount(Long opportunityId, String userId, Integer stepIndex) {
        Long totalUnread;
        Map<Integer, Long> stepUnreadCounts = new HashMap<>();

        if (stepIndex != null) {
            // Get unread count for specific step
            totalUnread = chatMessageRepository.countUnreadMessagesForUserAndStep(
                    opportunityId, userId, stepIndex
            );
            stepUnreadCounts.put(stepIndex, totalUnread);
        } else {
            // Get total unread count for all steps
            totalUnread = chatMessageRepository.countUnreadMessagesForUser(opportunityId, userId);

            // Get unread count per step
            List<Object[]> stepCounts = chatMessageRepository.countUnreadMessagesPerStepForUser(
                    opportunityId, userId
            );

            for (Object[] row : stepCounts) {
                Integer step = (Integer) row[0];
                Long count = (Long) row[1];
                stepUnreadCounts.put(step, count);
            }
        }

        ChatUnreadCountDto result = new ChatUnreadCountDto();
        result.setTotalUnread(totalUnread);
        result.setStepUnreadCounts(stepUnreadCounts);

        return result;
    }

    public void markMessagesAsRead(Long opportunityId, Integer stepIndex, String userId) {
        List<ChatMessage> unreadMessages = chatMessageRepository
                .findUnreadMessagesForUserAndStep(opportunityId, stepIndex, userId);

        for (ChatMessage message : unreadMessages) {
            // Don't mark own messages as read (they're already "read" by sender)
            if (!message.getSenderId().equals(userId)) {
                message.setIsRead(true);
            }
        }

        chatMessageRepository.saveAll(unreadMessages);
    }

    public List<Map<String, Object>> getChatParticipants(Long opportunityId) {
        // Get unique participants for this opportunity chat
        List<ChatMessage> messages = chatMessageRepository.findByOpportunityIdOrderByTimestampAsc(opportunityId);

        Set<String> uniqueUserIds = messages.stream()
                .map(ChatMessage::getSenderId)
                .collect(Collectors.toSet());

        List<Map<String, Object>> participants = new ArrayList<>();

        for (String userId : uniqueUserIds) {
            Optional<User> userOpt = userRepository.findById(Long.parseLong(userId));
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> participant = new HashMap<>();
                participant.put("id", user.getId());
                participant.put("name", user.getUsername());
                participant.put(
                        "roles",
                        user.getRoles().stream().map(Role::getName).collect(Collectors.toList())
                );

                participant.put("online", false); // You can implement online status later
                participants.add(participant);
            }
        }

        return participants;
    }

    public List<ChatMessageDto> getRecentMessages(Long opportunityId, int limit) {
        List<ChatMessage> messages = chatMessageRepository.findRecentMessages(opportunityId, limit);
        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Long getTotalMessageCount(Long opportunityId) {
        return chatMessageRepository.countByOpportunityId(opportunityId);
    }

    public Map<Integer, Long> getMessageCountPerStep(Long opportunityId) {
        List<Object[]> stepCounts = chatMessageRepository.countMessagesPerStep(opportunityId);

        Map<Integer, Long> result = new HashMap<>();
        for (Object[] row : stepCounts) {
            Integer step = (Integer) row[0];
            Long count = (Long) row[1];
            result.put(step, count);
        }

        return result;
    }

    private ChatMessageDto convertToDto(ChatMessage message) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(message.getId());
        dto.setMessageId(message.getMessageId());
        dto.setOpportunityId(message.getOpportunityId());
        dto.setStepIndex(message.getStepIndex());
        dto.setStepName(message.getStepName());
        dto.setSenderRole(message.getSenderRole().toString().toLowerCase());
        dto.setSenderName(message.getSenderName());
        dto.setSenderId(message.getSenderId());
        dto.setMessage(message.getMessage());
        dto.setTimestamp(message.getTimestamp());
        dto.setMessageType(message.getMessageType().toString().toLowerCase());
        dto.setIsRead(message.getIsRead());
        dto.setAttachments(message.getAttachments());

        return dto;
    }

    private ChatMessage convertToEntity(ChatMessageDto dto) {
        ChatMessage message = new ChatMessage();
        message.setId(dto.getId());
        message.setMessageId(dto.getMessageId());
        message.setOpportunityId(dto.getOpportunityId());
        message.setStepIndex(dto.getStepIndex());
        message.setStepName(dto.getStepName());
        message.setSenderRole(ChatMessage.SenderRole.valueOf(dto.getSenderRole().toUpperCase()));
        message.setSenderName(dto.getSenderName());
        message.setSenderId(dto.getSenderId());
        message.setMessage(dto.getMessage());
        message.setTimestamp(dto.getTimestamp());
        message.setMessageType(ChatMessage.MessageType.valueOf(dto.getMessageType().toUpperCase()));
        message.setIsRead(dto.getIsRead() != null ? dto.getIsRead() : false);
        message.setAttachments(dto.getAttachments());

        return message;
    }

    private String generateMessageId() {
        return "msg_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);
    }
}