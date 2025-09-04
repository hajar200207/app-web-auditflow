package com.auditflow.auditflow.controller;

import com.auditflow.auditflow.dto.ChatMessageDto;
import com.auditflow.auditflow.dto.ChatUnreadCountDto;
import com.auditflow.auditflow.model.ChatMessage;
import com.auditflow.auditflow.service.ChatService;
import com.auditflow.auditflow.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
//@CrossOrigin(origins = "*")
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // REST API Endpoints
    @GetMapping("/messages/{opportunityId}")
    public ResponseEntity<List<ChatMessageDto>> getMessages(
            @PathVariable Long opportunityId,
            @RequestParam(required = false) Integer stepIndex,
            @RequestHeader("Authorization") String token) {

        try {
            String jwtToken = token.replace("Bearer ", "");
            String userId = jwtService.getUserIdFromToken(jwtToken).toString();

            List<ChatMessageDto> messages = chatService.getMessages(opportunityId, stepIndex);

            // Mark messages as read for this user
            if (stepIndex != null) {
                chatService.markMessagesAsRead(opportunityId, stepIndex, userId);
            }

            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessageDto> sendMessage(
            @RequestBody ChatMessageDto messageDto,
            @RequestHeader("Authorization") String token) {

        try {
            String jwtToken = token.replace("Bearer ", "");
            String userId = jwtService.getUserIdFromToken(jwtToken).toString();
            String username = jwtService.extractUsername(jwtToken);

            // Set sender information
            messageDto.setSenderId(userId);
            messageDto.setSenderName(username);

            ChatMessageDto savedMessage = chatService.saveMessage(messageDto);

            // Send real-time notification via WebSocket
            String destination = "/topic/chat/" + messageDto.getOpportunityId();
            messagingTemplate.convertAndSend(destination, savedMessage);

            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/unread-count/{opportunityId}")
    public ResponseEntity<ChatUnreadCountDto> getUnreadCount(
            @PathVariable Long opportunityId,
            @RequestParam(required = false) Integer stepIndex,
            @RequestHeader("Authorization") String token) {

        try {
            String jwtToken = token.replace("Bearer ", "");
            String userId = jwtService.getUserIdFromToken(jwtToken).toString();

            ChatUnreadCountDto unreadCount = chatService.getUnreadCount(opportunityId, userId, stepIndex);
            return ResponseEntity.ok(unreadCount);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/mark-read/{opportunityId}")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable Long opportunityId,
            @RequestParam Integer stepIndex,
            @RequestHeader("Authorization") String token) {

        try {
            String jwtToken = token.replace("Bearer ", "");
            String userId = jwtService.getUserIdFromToken(jwtToken).toString();

            chatService.markMessagesAsRead(opportunityId, stepIndex, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // WebSocket endpoints for real-time features
    @MessageMapping("/chat.send")
    public void sendMessageViaWebSocket(@Payload ChatMessageDto message) {
        ChatMessageDto savedMessage = chatService.saveMessage(message);

        // Broadcast to all users in the same opportunity
        String destination = "/topic/chat/" + message.getOpportunityId();
        messagingTemplate.convertAndSend(destination, savedMessage);
    }

    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload Map<String, Object> typingInfo) {
        Long opportunityId = ((Number) typingInfo.get("opportunityId")).longValue();
        String userId = (String) typingInfo.get("userId");
        Boolean isTyping = (Boolean) typingInfo.get("isTyping");
        String userName = (String) typingInfo.get("userName");

        // Broadcast typing status to other users
        String destination = "/topic/typing/" + opportunityId;

        Map<String, Object> typingStatus = Map.of(
                "userId", userId,
                "userName", userName,
                "isTyping", isTyping,
                "timestamp", System.currentTimeMillis()
        );

        messagingTemplate.convertAndSend(destination, typingStatus);
    }

    @GetMapping("/participants/{opportunityId}")
    public ResponseEntity<List<Map<String, Object>>> getChatParticipants(
            @PathVariable Long opportunityId,
            @RequestHeader("Authorization") String token) {

        try {
            List<Map<String, Object>> participants = chatService.getChatParticipants(opportunityId);
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}