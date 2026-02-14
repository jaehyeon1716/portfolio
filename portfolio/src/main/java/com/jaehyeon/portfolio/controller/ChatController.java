package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.dto.ChatRequestDTO;
import com.jaehyeon.portfolio.dto.ChatResponseDTO;
import com.jaehyeon.portfolio.entity.ChatMessage;
import com.jaehyeon.portfolio.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate; // 추가
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate; // 특정 경로로 메시지를 보내는 도구

    @MessageMapping("/chat")
    public void handleChatMessage(ChatRequestDTO request) {
        // 1. 메시지 저장
        ChatMessage messageEntity = new ChatMessage();
        messageEntity.setRoomId(request.getRoomId());
        messageEntity.setSenderId(request.getSenderId());
        messageEntity.setMessage(request.getMessage());
        messageEntity.setTimestamp(LocalDateTime.now());
        chatMessageRepository.save(messageEntity);

        // 2. [추가] 채팅방 목록 정보를 위한 ChatRoom 테이블 업데이트 로직 (있다면)
        // chatRoomService.updateLastMessage(request.getRoomId(), request.getMessage());

        // 3. 전송
        ChatResponseDTO response = new ChatResponseDTO(messageEntity);
        messagingTemplate.convertAndSend("/sub/chat/" + request.getRoomId(), response);
    }
}