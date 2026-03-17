package com.jaehyeon.portfolio.controller;

import com.jaehyeon.portfolio.dto.BoardRequestDto;
import com.jaehyeon.portfolio.dto.BoardResponseDto;
import com.jaehyeon.portfolio.entity.BoardFile;
import com.jaehyeon.portfolio.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource; // 중요: osgi 대신 springframework.core.io 사용
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    /**
     * 게시글 등록 (JSON + Multipart)
     */
    @PostMapping(value = "/save", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Long> save(
            @RequestPart("postData") BoardRequestDto dto,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        Long id = boardService.save(dto, files);
        return ResponseEntity.ok(id);
    }

    /**
     * 게시글 수정 (JSON + Multipart)
     */
    @PutMapping(value = "/{id}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Void> updateBoard(
            @PathVariable Long id,
            @RequestPart("postData") BoardRequestDto dto,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        boardService.updateBoard(id, dto, files);
        return ResponseEntity.ok().build();
    }

    /**
     * 목록 조회
     */
    @GetMapping("/list/{category}")
    public ResponseEntity<Page<BoardResponseDto>> getList(
            @PathVariable String category,
            @PageableDefault(size = 10, sort = "regDate", direction = Sort.Direction.DESC) Pageable pageable,
            @ModelAttribute BoardRequestDto boardRequestDto) {

        return ResponseEntity.ok(boardService.getPostsByCategory(
                category,
                boardRequestDto.getSearchType(),
                boardRequestDto.getKeyword(),
                pageable));
    }

    /**
     * 상세 조회
     */
    @GetMapping("/detail/{id}")
    public ResponseEntity<BoardResponseDto> getBoardDetail(@PathVariable Long id){
        return ResponseEntity.ok(boardService.getBoardDetail(id));
    }

    /**
     * 삭제 (논리 삭제)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDel(@PathVariable Long id){
        boardService.deleteBoard(id);
        return ResponseEntity.ok().build();
    }

    /**
     * 첨부파일 다운로드
     */
    @GetMapping("/file/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        try {
            // 1. DB에서 파일 정보 조회
            BoardFile boardFile = boardService.getFileById(fileId);

            // 2. 파일 경로 준비 및 Resource 생성
            Path path = Paths.get(boardFile.getFilePath());
            Resource resource = new UrlResource(path.toUri());

            // 파일이 실제로 존재하는지 확인
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("파일을 찾을 수 없거나 읽을 수 없습니다.");
            }

            // 3. 파일명 브라우저 인코딩 (한글 깨짐 방지)
            String encodedFileName = UriUtils.encode(boardFile.getOriginalName(), StandardCharsets.UTF_8);

            // 4. Content-Disposition 설정
            String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}