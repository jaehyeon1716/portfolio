package com.jaehyeon.portfolio.service;

import com.jaehyeon.portfolio.dto.BoardRequestDto;
import com.jaehyeon.portfolio.dto.BoardResponseDto;
import com.jaehyeon.portfolio.entity.Board;
import com.jaehyeon.portfolio.entity.CommonCode;
import com.jaehyeon.portfolio.repository.BoardRepository;
import com.jaehyeon.portfolio.repository.CommonCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final CommonCodeRepository commonCodeRepository;

    @Transactional
    public Long save(BoardRequestDto dto){

        CommonCode category = commonCodeRepository.findByGroupIdAndCode("BOARD_CAT", dto.getCategory())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));

        Board board = new Board();
        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());
        board.setWriter(dto.getWriter());
        board.setCategory(category);
        board.setHit(dto.getHit() == null ? 0 : dto.getHit());
        board.setImportant(dto.isImportant());
        board.setDelYn(dto.isDelYn());

        Board savedBoard = boardRepository.save(board);

        return savedBoard.getId();
    }

    public Page<BoardResponseDto> getPostsByCategory(String categoryCode, Pageable pageable) {
        CommonCode category = commonCodeRepository.findByGroupIdAndCode("BOARD_CAT", categoryCode)
                .orElseThrow(() -> new IllegalArgumentException("없는 카테고리입니다."));
        boolean delYn = false;
        // DB에서 Page 형태로 조회하고, 각 Board 엔티티를 DTO로 매핑
        return boardRepository.findByCategoryAndDelYnOrderByIsImportantDescRegDateDesc(category, delYn, pageable)
                .map(BoardResponseDto::new);
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

        if (board.isDelYn()){
            throw new IllegalArgumentException("이미 삭제된 게시글입니다.");
        }

        board.setDelYn(true);
    }

    @Transactional
    public void updateBoard(Long id, BoardRequestDto boardRequestDto){
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        board.setTitle(boardRequestDto.getTitle());
        board.setContent(boardRequestDto.getContent());

        CommonCode category = commonCodeRepository.findByGroupIdAndCode("BOARD_CAT", boardRequestDto.getCategory())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        board.setCategory(category);
    }

}
