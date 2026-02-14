package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.config.JwtUtil;
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

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        String result = authService.register(user.getUsername(), user.getEmail(), user.getPassword());
        return Map.of("message", result);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        boolean ok = authService.login(user.getUsername(), user.getPassword());
        if(ok) {
            String token = JwtUtil.generateToken(user.getUsername());
            return Map.of("message", "로그인 성공", "token", token);
        } else {
            return Map.of("message", "로그인 실패");
        }
    }

}
