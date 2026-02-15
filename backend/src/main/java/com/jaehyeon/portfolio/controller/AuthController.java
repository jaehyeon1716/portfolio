package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.config.JwtUtil;
import com.jaehyeon.portfolio.dto.LoginRequestDTO;
import com.jaehyeon.portfolio.dto.RegisterRequestDTO;
import com.jaehyeon.portfolio.entity.User;
import com.jaehyeon.portfolio.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // 1. 회원가입: RegisterRequest 사용
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody RegisterRequestDTO request) {
        // DTO에서 데이터를 꺼내서 서비스에 전달
        String result = authService.register(
                request.getUsername(),
                request.getEmail(),
                request.getPassword()
        );
        return Map.of("message", result);
    }

    // 2. 로그인: LoginRequest 사용
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequestDTO request) {
        boolean ok = authService.login(request.getUsername(), request.getPassword());
        if(ok) {
            String token = JwtUtil.generateToken(request.getUsername());
            return Map.of(
                    "message", "로그인 성공",
                    "token", token,
                    "username", request.getUsername()
            );
        } else {
            return Map.of("message", "로그인 실패");
        }
    }
}
