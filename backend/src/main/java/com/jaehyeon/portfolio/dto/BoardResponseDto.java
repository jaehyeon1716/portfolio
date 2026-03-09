package com.jaehyeon.portfolio.dto;

import com.jaehyeon.portfolio.entity.Board;
import com.jaehyeon.portfolio.entity.CommonCode;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BoardResponseDto {
    private Long id;
    private String title;
    private String writer;
    private LocalDateTime regDate;
    private Long hit;
    private CommonCode category;
    private String content;
    private boolean isImportant;
    private boolean delYn;

    public BoardResponseDto(Board board){
        this.id = board.getId();
        this.title = board.getTitle();
        this.writer = board.getWriter();
        this.regDate = board.getRegDate();
        this.hit = board.getHit();
        this.category = board.getCategory();
        this.content = board.getContent();
        this.isImportant = board.isImportant();
        this.delYn = board.isDelYn();
    }
}
