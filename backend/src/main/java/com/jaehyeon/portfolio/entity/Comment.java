package com.jaehyeon.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    // 1. 게시글과의 연관관계 (어떤 글의 댓글인지)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    private String writer;
    private String content;

    @Column(name = "del_yn", nullable = false)
    private boolean delYn;

    @Builder.Default
    private LocalDateTime regDate = LocalDateTime.now();

    // --- 무한 대댓글을 위한 핵심 필드 ---

    // 2. 부모 댓글 (상위 댓글이 무엇인지)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent;

    // 3. 자식 댓글들 (해당 댓글에 달린 답글들)
    @Builder.Default
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> children = new ArrayList<>();
}