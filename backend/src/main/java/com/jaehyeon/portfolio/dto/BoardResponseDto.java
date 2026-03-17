package com.jaehyeon.portfolio.dto;

import com.jaehyeon.portfolio.entity.Board;
import com.jaehyeon.portfolio.entity.BoardFile;
import com.jaehyeon.portfolio.entity.CommonCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
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

    // 📁 파일 목록을 담을 리스트 추가
    private List<FileResponseDto> files;

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

        // 📎 엔티티의 fileList를 DTO 리스트로 변환 (null 체크 포함)
        if (board.getFileList() != null) {
            this.files = board.getFileList().stream()
                    .map(FileResponseDto::new)
                    .collect(Collectors.toList());
        }
    }

    /**
     * 파일 정보를 응답하기 위한 내부 DTO
     */
    @Getter
    public static class FileResponseDto {
        private Long id;
        private String originalName;
        private Long fileSize;

        public FileResponseDto(BoardFile boardFile) {
            this.id = boardFile.getId();
            this.originalName = boardFile.getOriginalName();
            this.fileSize = boardFile.getFileSize();
        }
    }
}