package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.dto.BoardRequestDto;
import com.jaehyeon.portfolio.dto.BoardResponseDto;
import com.jaehyeon.portfolio.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping("/save")
    public ResponseEntity<Long> save(@RequestBody BoardRequestDto dto){
        Long id = boardService.save(dto);

        return ResponseEntity.ok(id);
    }

    @GetMapping("/list/{category}")
    public ResponseEntity<Page<BoardResponseDto>> getList(
            @PathVariable String category,
            @PageableDefault(size = 10, sort = "regDate", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(boardService.getPostsByCategory(category, pageable));
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<BoardResponseDto> getBoardDetail(@PathVariable Long id){
        return ResponseEntity.ok(boardService.getBoardDetail(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDel(@PathVariable Long id){
        boardService.deleteBoard(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBoard(@PathVariable Long id, @RequestBody BoardRequestDto dto){
        boardService.updateBoard(id, dto);
        return ResponseEntity.ok().build();
    }

}
