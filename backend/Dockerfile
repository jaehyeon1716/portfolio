# 1. 자바 21 실행 환경 가져오기
FROM eclipse-temurin:21-jdk-jammy

# 2. 컨테이너 내 작업 디렉토리 생성
WORKDIR /app

# 3. 빌드된 JAR 파일을 컨테이너로 복사
# (주의: ./gradlew build를 먼저 실행해서 build/libs 폴더가 생성되어 있어야 합니다)
COPY build/libs/*.jar app.jar

# 4. 앱 실행
ENTRYPOINT ["java", "-jar", "app.jar"]