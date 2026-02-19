package com.jaehyeon.portfolio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. 브라우저에서 /uploads/** 경로로 접근하면
        registry.addResourceHandler("/uploads/**")
                // 2. 실제 물리적 경로인 C:/chat_uploads/ 폴더와 매핑한다.
                // 마지막에 반드시 / 를 붙여주세요.
                .addResourceLocations("file:///C:/chat_uploads/");
    }
}