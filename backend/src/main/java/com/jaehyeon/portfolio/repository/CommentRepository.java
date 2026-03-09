package com.jaehyeon.portfolio.repository;

import com.jaehyeon.portfolio.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBoardIdAndDelYnOrderByRegDateDesc(Long boardId, boolean delYn);
}
