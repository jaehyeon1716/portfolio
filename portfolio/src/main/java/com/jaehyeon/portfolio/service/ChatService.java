package com.jaehyeon.portfolio.service;

import com.jaehyeon.portfolio.dto.ChatRequestDTO;
import com.jaehyeon.portfolio.entity.ChatMessage;
import com.jaehyeon.portfolio.entity.ChatRoom;
import com.jaehyeon.portfolio.repository.ChatMessageRepository;
import com.jaehyeon.portfolio.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;

    @Transactional
    public ChatMessage saveMessageAndUpdateRoom(ChatRequestDTO request) {
        // 1. 채팅방 처리 로직 (컨트롤러에서 옮겨옴)
        ChatRoom room = chatRoomRepository.findById(request.getRoomId())
                .orElseGet(() -> {
                    ChatRoom newRoom = new ChatRoom();
                    newRoom.setRoomId(request.getRoomId());
                    newRoom.setUser1(request.getSenderId());

                    String[] ids = request.getRoomId().split("_");
                    if (ids.length >= 2) {
                        String opponentId = ids[0].equals(request.getSenderId()) ? ids[1] : ids[0];
                        newRoom.setUser2(opponentId);
                    } else {
                        newRoom.setUser2("Unknown");
                    }
                    return newRoom;
                });

        room.setLastMessage(request.getMessage());
        room.setLastChatTime(LocalDateTime.now());
        chatRoomRepository.save(room);

        // 2. 메시지 저장 로직
        ChatMessage messageEntity = new ChatMessage();
        messageEntity.setRoomId(request.getRoomId());
        messageEntity.setSenderId(request.getSenderId());
        messageEntity.setMessage(request.getMessage());
        messageEntity.setTimestamp(LocalDateTime.now());

        return chatMessageRepository.save(messageEntity);
    }

    @Transactional
    public void deleteChatRoomEntirely(String roomId){
        chatMessageRepository.deleteByRoomId(roomId);
        chatRoomRepository.deleteById(roomId);
    }
}