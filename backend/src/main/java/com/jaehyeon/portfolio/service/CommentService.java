package com.jaehyeon.portfolio.service;

import com.jaehyeon.portfolio.dto.CommentRequestDTO;
import com.jaehyeon.portfolio.dto.CommentResponseDTO;
import com.jaehyeon.portfolio.entity.Comment;
import com.jaehyeon.portfolio.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    public List<CommentResponseDTO> getCommentList(Long boardId){
        List<Comment> comments = commentRepository.findByBoardIdAndDelYnOrderByRegDateDesc(boardId, false);
        return comments.stream()
                .map(CommentResponseDTO::new)
                .collect(Collectors.toList());
    }

    public void saveComment(CommentRequestDTO commentRequestDTO){
        Comment comment = Comment.builder()
                .boardId(commentRequestDTO.getBoardId())
                .writer(commentRequestDTO.getWriter())
                .content(commentRequestDTO.getContent())
                .delYn(false) // 초기값 설정
                .regDate(LocalDateTime.now())
                .build();
        commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long id){
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다. id" + id));
        comment.setDelYn(true);
    }

    @Transactional
    public void updateComment(CommentRequestDTO commentRequestDTO, Long id){
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다. id" + id));
        comment.setContent(commentRequestDTO.getContent());
    }
}
