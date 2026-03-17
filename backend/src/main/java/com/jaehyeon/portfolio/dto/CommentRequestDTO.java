package com.jaehyeon.portfolio.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentRequestDTO {
    private Long boardId;
    private String writer;
    private String content;
    private Long parentId; // 이 필드를 추가하면 빨간 줄이 사라집니다!
}