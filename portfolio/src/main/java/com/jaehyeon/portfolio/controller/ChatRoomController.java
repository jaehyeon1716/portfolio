package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.dto.ChatRoomResponseDTO;
import com.jaehyeon.portfolio.entity.ChatRoom;
import com.jaehyeon.portfolio.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors; // 스트림 변환을 위해 필수!

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomRepository chatRoomRepository;

    /**
     * 내가 참여 중인 모든 채팅방 목록 조회
     * @param username 현재 로그인한 사용자의 아이디
     * @return 가공된 채팅방 목록 DTO 리스트
     */
    @GetMapping("/rooms")
    public List<ChatRoomResponseDTO> getMyRooms(@RequestParam("username") String username) {
        // 1. Repository에서 엔티티 리스트를 가져옴
        return chatRoomRepository.findByUser1OrUser2OrderByLastChatTimeDesc(username, username)
                .stream()
                // 2. 각 ChatRoom 엔티티를 ChatRoomResponseDTO로 변환 (현재 접속자 정보 전달)
                .map(room -> new ChatRoomResponseDTO(room, username))
                // 3. 다시 리스트로 수집
                .collect(Collectors.toList());
    }
}