package com.jaehyeon.portfolio.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ChatRequestDTO {
    private String roomId;
    private String senderId;
    private String message;
}