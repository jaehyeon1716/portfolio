package com.jaehyeon.portfolio.service;

import com.jaehyeon.portfolio.dto.ChatRequestDTO;
import com.jaehyeon.portfolio.entity.ChatMessage;
import com.jaehyeon.portfolio.entity.ChatRoom;
import com.jaehyeon.portfolio.repository.ChatMessageRepository;
import com.jaehyeon.portfolio.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value; // 추가됨
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;

    // application.yml의 upload.path 값을 가져오고, 없으면 기본값(C:/chat_uploads/) 사용
    @Value("${upload.path:C:/chat_uploads/}")
    private String uploadDir;

    @Transactional
    public ChatMessage saveMessageAndUpdateRoom(ChatRequestDTO request) {
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

        ChatMessage messageEntity = new ChatMessage();
        messageEntity.setRoomId(request.getRoomId());
        messageEntity.setSenderId(request.getSenderId());
        messageEntity.setMessage(request.getMessage());
        messageEntity.setTimestamp(LocalDateTime.now());

        return chatMessageRepository.save(messageEntity);
    }

    @Transactional
    public ChatMessage uploadFile(MultipartFile file, String roomId, String senderId) throws IOException {
        // 1. 디렉토리 생성
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            if (!created) {
                throw new IOException("디렉토리 생성 실패: " + uploadDir);
            }
        }

        // 2. 파일 저장
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(uploadDir, fileName); // 경로와 파일명 결합 최적화
        file.transferTo(dest);

        // 3. 메시지 형식 생성 및 저장
        String filePath = "/uploads/" + fileName;
        ChatRequestDTO fileRequest = new ChatRequestDTO();
        fileRequest.setRoomId(roomId);
        fileRequest.setSenderId(senderId);
        fileRequest.setMessage("[FILE]:" + fileName + "|" + filePath);

        // 기존 저장 로직 재활용
        return saveMessageAndUpdateRoom(fileRequest);
    }

    @Transactional
    public void deleteChatRoomEntirely(String roomId){
        chatMessageRepository.deleteByRoomId(roomId);
        chatRoomRepository.deleteById(roomId);
    }
}