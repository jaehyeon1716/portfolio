package com.jaehyeon.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
    private Long boardId;
    private String writer;
    private String content;
    @Column(name = "del_yn", nullable = false)
    private boolean delYn;

    @Builder.Default
    private LocalDateTime regDate = LocalDateTime.now();
}
