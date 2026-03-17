package com.jaehyeon.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "board")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Board {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String content;
    private String writer;
    @Column(name = "del_yn", nullable = false)
    private boolean delYn;

    @Builder.Default
    @Column(nullable = false)
    private Long hit = 0L;

    @Column(name = "is_important", nullable = false)
    private boolean isImportant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private CommonCode category;

    @CreatedDate
    private LocalDateTime regDate = LocalDateTime.now();

    public void increaseHit(){
        this.hit = (this.hit == null ? 0 : this.hit) + 1;
    }

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BoardFile> fileList = new ArrayList<>();
}
