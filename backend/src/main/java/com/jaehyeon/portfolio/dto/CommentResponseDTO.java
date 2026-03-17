package com.jaehyeon.portfolio.dto;

import com.jaehyeon.portfolio.entity.Comment;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class CommentResponseDTO {
    private Long id;
    private String content;
    private String writer;
    private LocalDateTime regDate;
    private Long parentId;
    private List<CommentResponseDTO> children = new ArrayList<>(); // 자식 댓글 리스트

    public CommentResponseDTO(Comment entity) {
        this.id = entity.getId();
        this.content = entity.getContent();
        this.writer = entity.getWriter();
        this.regDate = entity.getRegDate();
        this.parentId = entity.getParent() != null ? entity.getParent().getId() : null;
    }
}
