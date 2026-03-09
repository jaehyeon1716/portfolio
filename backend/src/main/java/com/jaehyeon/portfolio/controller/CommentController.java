package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.dto.CommentRequestDTO;
import com.jaehyeon.portfolio.dto.CommentResponseDTO;
import com.jaehyeon.portfolio.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{boardId}")
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable Long boardId){
        return ResponseEntity.ok(commentService.getCommentList(boardId));
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveComment(@RequestBody CommentRequestDTO requestDto) {
        commentService.saveComment(requestDto);
        return ResponseEntity.ok("댓글이 등록되었습니다.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id){
        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateComment(@PathVariable Long id, @RequestBody CommentRequestDTO requestDTO){
        commentService.updateComment(requestDTO, id);
        return ResponseEntity.ok().build();
    }
}
