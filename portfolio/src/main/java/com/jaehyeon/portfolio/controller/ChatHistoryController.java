package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.dto.ChatResponseDTO;
import com.jaehyeon.portfolio.entity.ChatMessage;
import com.jaehyeon.portfolio.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatHistoryController {
    private final ChatMessageRepository chatMessageRepository;

    @GetMapping("/history")
    public List<ChatResponseDTO> getChatHistory(@RequestParam String roomId) {
        return chatMessageRepository.findByRoomId(roomId).stream()
                .map(ChatResponseDTO::new)
                .collect(Collectors.toList());
    }
}