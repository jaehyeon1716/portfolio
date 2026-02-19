package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.dto.ChatRequestDTO;
import com.jaehyeon.portfolio.dto.ChatResponseDTO;
import com.jaehyeon.portfolio.dto.ChatRoomResponseDTO;
import com.jaehyeon.portfolio.entity.ChatMessage;
import com.jaehyeon.portfolio.entity.ChatRoom;
import com.jaehyeon.portfolio.repository.ChatMessageRepository;
import com.jaehyeon.portfolio.repository.ChatRoomRepository;
import com.jaehyeon.portfolio.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors; // 스트림 변환을 위해 필수!

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRoomController {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatService chatService;
    private final SimpMessagingTemplate simpMessagingTemplate;

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

    @PostMapping("/upload")
    public ResponseEntity<ChatResponseDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("roomId") String roomId,
            @RequestParam("senderId") String senderId) throws IOException {

        // 1. 서비스 호출하여 파일 저장 및 DB 기록
        ChatMessage savedMessage = chatService.uploadFile(file, roomId, senderId);

        // 2. 응답 DTO 변환
        ChatResponseDTO response = new ChatResponseDTO(savedMessage);

        // 3. WebSocket 실시간 알림 전송
        simpMessagingTemplate.convertAndSend("/sub/chat/" + roomId, response);

        return ResponseEntity.ok(response);
    }
}