package com.jaehyeon.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "board")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String content;
    private String writer;

    @Builder.Default
    private Long hit = 0L;

    @Column(name = "is_important")
    private boolean isImportant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private CommonCode category;

    private LocalDateTime regDate = LocalDateTime.now();

}
