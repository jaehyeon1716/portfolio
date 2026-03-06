package com.jaehyeon.portfolio.dto;

import com.jaehyeon.portfolio.entity.Board;
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

    public BoardResponseDto(Board board){
        this.id = board.getId();
        this.title = board.getTitle();
        this.writer = board.getWriter();
        this.regDate = board.getRegDate();
        this.hit = board.getHit();
    }
}
