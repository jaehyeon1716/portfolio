package com.jaehyeon.portfolio.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.security.PrivateKey;

@Getter
@Setter
@NoArgsConstructor
public class BoardRequestDto {
    private String title;
    private String content;
    private String writer;
    private String category;
    private Long hit;

    @JsonProperty("is_important")
    private boolean isImportant;

}
