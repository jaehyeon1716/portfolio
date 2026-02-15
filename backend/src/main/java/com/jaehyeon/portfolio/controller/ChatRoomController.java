package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.dto.ChatResponseDTO;
import com.jaehyeon.portfolio.dto.ChatRoomResponseDTO;
import com.jaehyeon.portfolio.entity.ChatRoom;
import com.jaehyeon.portfolio.repository.ChatMessageRepository;
import com.jaehyeon.portfolio.repository.ChatRoomRepository;
import com.jaehyeon.portfolio.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors; // 스트림 변환을 위해 필수!

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRoomController {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatService chatService;

    // 1. 대화방 목록 조회
    @GetMapping("/chatroom")
    public List<ChatRoomResponseDTO> getMyRooms(@RequestParam String username) {
        return chatRoomRepository.findByUser1OrUser2OrderByLastChatTimeDesc(username, username)
                .stream()
                .map(room -> new ChatRoomResponseDTO(room, username))
                .collect(Collectors.toList());
    }

    // 2. 채팅 내역 조회 (History에서 옮겨옴)
    @GetMapping("/history")
    public List<ChatResponseDTO> getChatHistory(@RequestParam String roomId) {
        return chatMessageRepository.findByRoomId(roomId).stream()
                .map(ChatResponseDTO::new)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/chatroom/{roomId}")
    public ResponseEntity<String> deleteRoom(@PathVariable String roomId){
        chatService.deleteChatRoomEntirely(roomId);
        return ResponseEntity.ok("삭제 성공");
    }
}