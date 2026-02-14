package com.jaehyeon.portfolio.dto;

import com.jaehyeon.portfolio.entity.ChatRoom;
import lombok.Getter;

@Getter
public class ChatRoomResponseDTO {
    private String roomId;
    private String otherUser;    // 내가 아닌 상대방 이름
    private String lastMessage;
    private String lastTime;     // 가공된 시간 문자열

    public ChatRoomResponseDTO(ChatRoom entity, String myName) {
        this.roomId = entity.getRoomId();
        // user1과 user2 중 내가 아닌 사람을 otherUser로 설정
        this.otherUser = entity.getUser1().equals(myName) ? entity.getUser2() : entity.getUser1();
        this.lastMessage = entity.getLastMessage();
        this.lastTime = entity.getLastChatTime().toString(); // 날짜 가공 로직 추가 가능
    }
}