package com.jaehyeon.portfolio.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class CommonCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String groupId;  // 'BOARD_CAT'
    private String code;     // 'NOTICE'
    private String codeNm;   // '공지사항'
    private int sortSeq;     // 1
    private String useYn;    // 'Y'
}
