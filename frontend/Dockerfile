# 1. 노드 버전 일치시키기 (내 개발 환경에 맞춰 22 이상 사용)
FROM node:24-alpine

WORKDIR /app

# 2. 패키지 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 3. 소스 코드 복사
COPY . .

# 4. Vite 외부 접속 허용 설정 (중요!)
ENV HOST=0.0.0.0
EXPOSE 3000

# 5. package.json에 적힌 start 명령어 실행 (vite)
CMD ["npm", "start", "--", "--host", "0.0.0.0"]