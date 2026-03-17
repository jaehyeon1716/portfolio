package com.jaehyeon.portfolio.service;

import com.jaehyeon.portfolio.dto.BoardRequestDto;
import com.jaehyeon.portfolio.dto.BoardResponseDto;
import com.jaehyeon.portfolio.entity.Board;
import com.jaehyeon.portfolio.entity.BoardFile;
import com.jaehyeon.portfolio.entity.CommonCode;
import com.jaehyeon.portfolio.repository.BoardFileRepository; // 추가
import com.jaehyeon.portfolio.repository.BoardRepository;
import com.jaehyeon.portfolio.repository.CommonCodeRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final CommonCodeRepository commonCodeRepository;
    private final BoardFileRepository boardFileRepository; // 1. 파일 조회를 위해 주입 추가

    private final String uploadPath = "C:/portfolio/uploads/";

    /**
     * 파일 다운로드를 위한 파일 정보 조회
     */
    @Transactional(readOnly = true)
    public BoardFile getFileById(Long fileId) {
        return boardFileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("해당 파일이 존재하지 않습니다. ID: " + fileId));
    }

    @Transactional
    public Long save(BoardRequestDto dto, List<MultipartFile> files) throws IOException {
        CommonCode category = commonCodeRepository.findByGroupIdAndCode("BOARD_CAT", dto.getCategory())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));

        Board board = Board.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .writer(dto.getWriter())
                .category(category)
                .hit(0L)
                .isImportant(dto.isImportant())
                .delYn(false)
                .fileList(new ArrayList<>())
                .build();

        if (files != null && !files.isEmpty()) {
            this.uploadFiles(board, files);
        }

        return boardRepository.save(board).getId();
    }

    @Transactional
    public void updateBoard(Long id, BoardRequestDto dto, List<MultipartFile> files) throws IOException {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        CommonCode category = commonCodeRepository.findByGroupIdAndCode("BOARD_CAT", dto.getCategory())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());
        board.setCategory(category);
        board.setImportant(dto.isImportant());

        if (files != null && !files.isEmpty()) {
            this.uploadFiles(board, files);
        }
    }

    private void uploadFiles(Board board, List<MultipartFile> files) throws IOException {
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String originalName = file.getOriginalFilename();
            String savedName = UUID.randomUUID().toString() + "_" + originalName;
            String fullPath = uploadPath + savedName;

            file.transferTo(new File(fullPath));

            BoardFile boardFile = BoardFile.builder()
                    .originalName(originalName)
                    .savedName(savedName)
                    .filePath(fullPath)
                    .fileSize(file.getSize())
                    .board(board)
                    .build();

            board.getFileList().add(boardFile);
        }
    }

    // --- 목록 조회 및 상세 정보 로직 ---

    @Transactional(readOnly = true)
    public Page<BoardResponseDto> getPostsByCategory(String categoryCode, String searchType, String keyword, Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "isImportant")
                        .and(Sort.by(Sort.Direction.DESC, "regDate"))
        );

        Specification<Board> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("category").get("code"), categoryCode));
            predicates.add(cb.equal(root.get("delYn"), false));

            if (keyword != null && !keyword.trim().isEmpty()) {
                String likePattern = "%" + keyword + "%";
                switch (searchType) {
                    case "title" -> predicates.add(cb.like(root.get("title"), likePattern));
                    case "writer" -> predicates.add(cb.like(root.get("writer"), likePattern));
                    case "content" -> predicates.add(cb.like(root.get("content"), likePattern));
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return boardRepository.findAll(spec, sortedPageable).map(BoardResponseDto::new);
    }

    @Transactional
    public BoardResponseDto getBoardDetail(Long id){
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));
        board.increaseHit();
        return new BoardResponseDto(board);
    }

    @Transactional
    public void deleteBoard(Long id){
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        if (board.isDelYn()) throw new IllegalArgumentException("이미 삭제된 게시글입니다.");
        board.setDelYn(true);
    }
}