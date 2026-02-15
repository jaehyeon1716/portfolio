package com.jaehyeon.portfolio.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class ChatRoom {
    @Id
    private String roomId; // UUID 등으로 생성 (예: "user1_user2")
    private String user1;
    private String user2;
    private String lastMessage; // 목록에서 보여줄 마지막 메시지
    private LocalDateTime lastChatTime;
}