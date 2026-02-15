package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.dto.ChatRequestDTO;
import com.jaehyeon.portfolio.dto.ChatResponseDTO;
import com.jaehyeon.portfolio.entity.ChatMessage;
import com.jaehyeon.portfolio.service.ChatService; // 추가
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void handleChatMessage(ChatRequestDTO request) {
        ChatMessage savedMessage = chatService.saveMessageAndUpdateRoom(request);
        ChatResponseDTO response = new ChatResponseDTO(savedMessage);
        messagingTemplate.convertAndSend("/sub/chat/" + request.getRoomId(), response);
    }
}