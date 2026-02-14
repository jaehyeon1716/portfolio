package com.jaehyeon.portfolio.service;

import com.jaehyeon.portfolio.entity.Role; // Role 임포트 확인!
import com.jaehyeon.portfolio.entity.User;
import com.jaehyeon.portfolio.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Transactional // 데이터 저장 시 예외 발생하면 롤백되도록 추가
    public String register(String username, String email, String rawPassword) {

        // 1. 중복 검사
        if(userRepository.existsByUsername(username)) {
            return "Error: 중복된 아이디입니다!";
        }

        // 2. 패스워드 암호화
        String encoded = passwordEncoder.encode(rawPassword);

        // 3. 엔티티 생성 및 필드 설정
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encoded);

        // 중요: Role 설정 (Enum 사용)
        user.setRole(Role.USER);

        // 4. DB 저장
        userRepository.save(user);

        return "회원가입 성공!";
    }

    public boolean login(String username, String rawPassword) {
        return userRepository.findByUsername(username)
                .map(user -> passwordEncoder.matches(rawPassword, user.getPassword()))
                .orElse(false);
    }
}