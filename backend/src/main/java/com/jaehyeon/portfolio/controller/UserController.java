package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.dto.UserResponseDTO;
import com.jaehyeon.portfolio.entity.User;
import com.jaehyeon.portfolio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/list")
    public List<UserResponseDTO> getUserList() {
        List<User> users = userRepository.findAllByOrderByCreatedAtDesc();

        // Entity를 DTO로 변환하여 비밀번호 제외하고 반환
        return users.stream()
                .map(user -> new UserResponseDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}