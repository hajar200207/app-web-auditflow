package com.auditflow.auditflow.repository;

import com.auditflow.auditflow.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Find messages by opportunity and step
    List<ChatMessage> findByOpportunityIdAndStepIndexOrderByTimestampAsc(Long opportunityId, Integer stepIndex);

    // Find all messages for an opportunity
    List<ChatMessage> findByOpportunityIdOrderByTimestampAsc(Long opportunityId);

    // Find messages by message ID
    ChatMessage findByMessageId(String messageId);

    // Count total messages for opportunity
    Long countByOpportunityId(Long opportunityId);

    // Count unread messages for a specific user and opportunity
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.opportunityId = :opportunityId " +
            "AND m.senderId != :userId AND m.isRead = false")
    Long countUnreadMessagesForUser(@Param("opportunityId") Long opportunityId,
                                    @Param("userId") String userId);

    // Count unread messages for a specific user, opportunity and step
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.opportunityId = :opportunityId " +
            "AND m.stepIndex = :stepIndex AND m.senderId != :userId AND m.isRead = false")
    Long countUnreadMessagesForUserAndStep(@Param("opportunityId") Long opportunityId,
                                           @Param("userId") String userId,
                                           @Param("stepIndex") Integer stepIndex);

    // Count unread messages per step for a user
    @Query("SELECT m.stepIndex, COUNT(m) FROM ChatMessage m WHERE m.opportunityId = :opportunityId " +
            "AND m.senderId != :userId AND m.isRead = false GROUP BY m.stepIndex")
    List<Object[]> countUnreadMessagesPerStepForUser(@Param("opportunityId") Long opportunityId,
                                                     @Param("userId") String userId);

    // Find unread messages for a user and step
    @Query("SELECT m FROM ChatMessage m WHERE m.opportunityId = :opportunityId " +
            "AND m.stepIndex = :stepIndex AND m.senderId != :userId AND m.isRead = false")
    List<ChatMessage> findUnreadMessagesForUserAndStep(@Param("opportunityId") Long opportunityId,
                                                       @Param("stepIndex") Integer stepIndex,
                                                       @Param("userId") String userId);

    // Count messages per step
    @Query("SELECT m.stepIndex, COUNT(m) FROM ChatMessage m WHERE m.opportunityId = :opportunityId " +
            "GROUP BY m.stepIndex ORDER BY m.stepIndex")
    List<Object[]> countMessagesPerStep(@Param("opportunityId") Long opportunityId);

    // Find recent messages with limit
    @Query("SELECT m FROM ChatMessage m WHERE m.opportunityId = :opportunityId " +
            "ORDER BY m.timestamp DESC")
    List<ChatMessage> findRecentMessages(@Param("opportunityId") Long opportunityId,
                                         @Param("limit") int limit);

    // Find latest message for each step
    @Query("SELECT DISTINCT m1 FROM ChatMessage m1 WHERE m1.opportunityId = :opportunityId " +
            "AND m1.timestamp = (SELECT MAX(m2.timestamp) FROM ChatMessage m2 " +
            "WHERE m2.opportunityId = :opportunityId AND m2.stepIndex = m1.stepIndex)")
    List<ChatMessage> findLatestMessagePerStep(@Param("opportunityId") Long opportunityId);

    // Find messages by sender
    List<ChatMessage> findByOpportunityIdAndSenderIdOrderByTimestampAsc(Long opportunityId, String senderId);

    // Find messages by message type
    List<ChatMessage> findByOpportunityIdAndMessageTypeOrderByTimestampAsc(Long opportunityId,
                                                                           ChatMessage.MessageType messageType);

    // Delete messages older than specified date
    @Query("DELETE FROM ChatMessage m WHERE m.opportunityId = :opportunityId " +
            "AND m.timestamp < :cutoffDate")
    void deleteOldMessages(@Param("opportunityId") Long opportunityId,
                           @Param("cutoffDate") java.time.LocalDateTime cutoffDate);
}