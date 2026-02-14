package com.jaehyeon.portfolio.service;

import com.jaehyeon.portfolio.entity.User;
import com.jaehyeon.portfolio.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public String register(String username, String email, String rawPassword) {

        String message = "";
        if(userRepository.existsByUsername(username)) {
            message = "Error: 중복된 아이디입니다!";
            return message;
        } else {
            message = "회원가입 성공!";
        }

        String encoded = passwordEncoder.encode(rawPassword);
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encoded);
        userRepository.save(user);

        return message;
    }

    public boolean login(String username, String rawPassword) {
        return userRepository.findByUsername(username)
                .map(user -> passwordEncoder.matches(rawPassword, user.getPassword()))
                .orElse(false);
    }
}
