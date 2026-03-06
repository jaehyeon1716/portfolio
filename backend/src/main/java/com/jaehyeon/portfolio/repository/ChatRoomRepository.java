package com.jaehyeon.portfolio.repository;

import com.jaehyeon.portfolio.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
    // 사용자 이름으로 참여 중인 방 찾기
    List<ChatRoom> findByUser1OrUser2OrderByLastChatTimeDesc(String user1, String user2);
}