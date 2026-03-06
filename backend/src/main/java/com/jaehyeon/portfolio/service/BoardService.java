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

import java.util.List;
import java.util.stream.Collectors;

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

        Board savedBoard = boardRepository.save(board);

        return savedBoard.getId();
    }

    /*public List<BoardResponseDto> getPostsByCategory(String categoryCode){
        CommonCode category = commonCodeRepository.findByGroupIdAndCode("BOARD_CAT", categoryCode)
                .orElseThrow(() -> new IllegalArgumentException("없는 카테고리입니다."));

        return boardRepository.findByCategoryOrderByRegDateDesc(category)
                .stream()
                .map(BoardResponseDto::new) // 아래 설명할 DTO
                .collect(Collectors.toList());
    }*/

    public Page<BoardResponseDto> getPostsByCategory(String categoryCode, Pageable pageable) {
        CommonCode category = commonCodeRepository.findByGroupIdAndCode("BOARD_CAT", categoryCode)
                .orElseThrow(() -> new IllegalArgumentException("없는 카테고리입니다."));

        // DB에서 Page 형태로 조회하고, 각 Board 엔티티를 DTO로 매핑
        return boardRepository.findByCategory(category, pageable)
                .map(BoardResponseDto::new);
    }

}
