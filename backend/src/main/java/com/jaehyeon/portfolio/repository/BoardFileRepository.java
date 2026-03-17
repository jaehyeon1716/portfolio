package com.jaehyeon.portfolio.repository;

import com.jaehyeon.portfolio.entity.BoardFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardFileRepository extends JpaRepository<BoardFile, Long> {
}
