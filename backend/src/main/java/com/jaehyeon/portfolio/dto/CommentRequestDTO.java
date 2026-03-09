package com.jaehyeon.portfolio.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter // 데이터를 서버에서 받을 때는 Setter가 필요합니다.
public class CommentRequestDTO {
    private Long boardId;
    private String writer;
    private String content;
}