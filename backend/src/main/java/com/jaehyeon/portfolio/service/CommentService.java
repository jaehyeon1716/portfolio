package com.jaehyeon.portfolio.service;

import com.jaehyeon.portfolio.dto.CommentRequestDTO;
import com.jaehyeon.portfolio.dto.CommentResponseDTO;
import com.jaehyeon.portfolio.entity.Board;
import com.jaehyeon.portfolio.entity.Comment;
import com.jaehyeon.portfolio.repository.BoardRepository;
import com.jaehyeon.portfolio.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;

    public List<CommentResponseDTO> getCommentList(Long boardId) {
        // 일단 해당 게시글의 모든 댓글을 가져옵니다.
        List<Comment> allComments = commentRepository.findByBoardIdAndDelYnOrderByRegDateAsc(boardId, false);

        // 전체를 DTO로 변환
        List<CommentResponseDTO> allDtos = allComments.stream()
                .map(CommentResponseDTO::new)
                .collect(Collectors.toList());

        // ID를 키로 하는 Map을 만들어 조회를 빠르게 합니다.
        Map<Long, CommentResponseDTO> map = allDtos.stream()
                .collect(Collectors.toMap(CommentResponseDTO::getId, dto -> dto));

        List<CommentResponseDTO> rootComments = new ArrayList<>();

        for (CommentResponseDTO dto : allDtos) {
            if (dto.getParentId() == null) {
                // 부모가 없으면 최상위 댓글 리스트에 추가
                rootComments.add(dto);
            } else {
                // 부모가 있으면 해당 부모 DTO의 children 리스트에 추가
                CommentResponseDTO parentDto = map.get(dto.getParentId());
                if (parentDto != null) {
                    parentDto.getChildren().add(dto);
                }
            }
        }
        return rootComments; // 최상위 댓글만 반환 (안에 자식들이 포함되어 있음)
    }

    // 2. 댓글 저장 (일반 댓글 및 대댓글 공용)
    public void saveComment(CommentRequestDTO dto) {
        Board board = boardRepository.findById(dto.getBoardId())
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));

        Comment parent = null;
        if (dto.getParentId() != null) {
            parent = commentRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("부모 댓글이 없습니다."));
        }

        Comment comment = Comment.builder()
                .board(board)
                .writer(dto.getWriter())
                .content(dto.getContent())
                .parent(parent) // 대댓글일 경우 부모 설정
                .delYn(false)
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
