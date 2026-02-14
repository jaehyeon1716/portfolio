package com.jaehyeon.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages") // PostgreSQL 테이블 이름
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderId; // username

    @Column(columnDefinition = "TEXT")
    private String message;

    private LocalDateTime timestamp;

    private String roomId;

    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now();
    }
}