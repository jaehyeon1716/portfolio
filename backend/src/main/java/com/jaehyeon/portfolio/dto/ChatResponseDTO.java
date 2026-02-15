package com.jaehyeon.portfolio.dto;

import com.jaehyeon.portfolio.entity.ChatMessage;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class ChatResponseDTO {
    private Long id;
    private String roomId;
    private String senderId;
    private String message;
    private LocalDateTime timestamp;

    // 엔티티를 DTO로 변환하는 생성자
    public ChatResponseDTO(ChatMessage entity) {
        this.id = entity.getId();
        this.roomId = entity.getRoomId();
        this.senderId = entity.getSenderId();
        this.message = entity.getMessage();
        this.timestamp = entity.getTimestamp();
    }
}