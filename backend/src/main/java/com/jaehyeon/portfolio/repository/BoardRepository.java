package com.jaehyeon.portfolio.repository;

import com.jaehyeon.portfolio.entity.Board;
import com.jaehyeon.portfolio.entity.CommonCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    /*List<Board> findByCategoryOrderByRegDateDesc(CommonCode category);*/
    Page<Board> findByCategoryAndDelYnOrderByIsImportantDescRegDateDesc(CommonCode category, boolean delYn, Pageable pageable);
}
