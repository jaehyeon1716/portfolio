package com.jaehyeon.portfolio.dto;

import com.jaehyeon.portfolio.entity.Comment;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class CommentResponseDTO {
    private Long id;
    private Long boardId;
    private String writer;
    private String content;
    private boolean delYn;
    private LocalDateTime regDate;

    public CommentResponseDTO(Comment comment){
        this.id = comment.getId();
        this.boardId = comment.getBoardId();
        this.writer = comment.getWriter();
        this.content = comment.getContent();
        this.delYn = comment.isDelYn();
        this.regDate = comment.getRegDate();
    }
}
