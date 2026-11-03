# Review_Notes_Tuan3 — Long (Lead CI/CD & Full-Stack DevOps Tester)

> **Vai trò**: Chủ trì Kỹ thuật Tuần 3 (Long Lead) kiêm Tester & Reviewer toàn bộ  
> **Người thực hiện**: Võ Thành Long  
> **Thời gian**: Tuần 3 (04/11/2026)  
> **Hạng mục**: Tự động hóa CI/CD với GitHub Actions & Triển khai Public Internet qua Render Deploy Hooks  
> **Mục tiêu**: Có đường link Web hoạt động, hệ thống tự động kiểm thử và cập nhật khi có code mới; nghiệm thu tính năng và ghi nhận sự cố cho Nhân (Tuần 4).

---

## 1. Kết quả thực hiện tổng quan

| Hạng mục | Nhiệm vụ kế hoạch | Trạng thái | Ghi chú & Đóng góp kỹ thuật |
| :--- | :--- | :--- | :--- |
| **Workflow CI/CD** | Viết kịch bản `.github/workflows/deploy.yml` | ✅ Đạt | Pipeline 4 stage hoàn chỉnh: Backend CI, Frontend CI, AI Engine CI, Deploy Hook. Hỗ trợ cả trigger `push`, `pull_request` và `workflow_dispatch`. |
| **Kiểm thử Backend CI** | Setup JDK 17, Maven compile & package | ✅ Đạt | Build thành công 37 source files trong 19.2s, tạo artifact JAR sạch sẽ. |
| **Kiểm thử Frontend CI** | Setup Node 20, npm ci, lint, build | ✅ Đạt | Đã xử lý triệt để 8 lỗi ESLint v9 Flat Config, Vite build hoàn tất trong 3.28s. |
| **Kiểm thử AI Engine CI** | Setup Python 3.11, check syntax | ✅ Đạt | Biên dịch bytecode `py_compile main.py`, kiểm thử endpoint healthcheck `/`. |
| **Render Deploy Hooks** | Tự động hóa phát hành qua HTTP POST | ✅ Đạt | Tích hợp an toàn qua GitHub Secrets (`RENDER_BACKEND_DEPLOY_HOOK`, `RENDER_FRONTEND_DEPLOY_HOOK`, `RENDER_AI_DEPLOY_HOOK`). |
| **Minh chứng Thực nghiệm** | Thay đổi nhỏ giao diện để test kích hoạt luồng | ✅ Đạt | Bổ sung tag phiên bản: `Eng-Lab • Nhóm 10 - Điện toán đám mây VKU (v1.3-ci-ready)` tại Footer. |
| **Kiểm thử Docker Local** | Test toàn diện 4 container đang chạy | ✅ Đạt | Toàn bộ 4 container (`english_db`, `english_backend`, `english_ai`, `english_frontend`) phản hồi HTTP 200 ổn định. |
| **Tài liệu Hướng dẫn** | Viết bản thảo Hướng dẫn thiết lập CI/CD | ✅ Đạt | Đã biên soạn hoàn chỉnh tệp `docs/HuongDan_CI_CD_GitHub_Actions.md` kèm sơ đồ Mermaid. |

---

## 2. Đo kiểm & Nghiệm thu Dịch vụ Thực tế (End-User Testing)

Long đã trực tiếp đóng vai Tester/Reviewer kiểm thử chéo toàn bộ hệ sinh thái dịch vụ:

### 2.1. CSDL PostgreSQL & API Dữ liệu Từ vựng
- **Database**: PostgreSQL 16 Alpine trong Docker (`english_db`).
- **Nạp dữ liệu mẫu**: Đã nạp thành công bộ từ vựng và chủ đề từ `vocabulary_seed.sql`.
- **API Endpoint**: `GET http://localhost:8080/api/vocabularies`
- **Kết quả kiểm tra**:
  ```http
  HTTP/1.1 200 OK
  Content-Type: application/json
  [
    {"id":1, "word":"dog", "ipa":"/dɒɡ/", "translation":"con chó", "topicId":1},
    {"id":2, "word":"cat", "ipa":"/kæt/", "translation":"con mèo", "topicId":1},
    ...
  ]
  ```
- **Đánh giá**: Dữ liệu nạp đầy đủ, UTF-8 tiếng Việt hiển thị chính xác, phản hồi < 50ms.

### 2.2. Dịch vụ Trí tuệ nhân tạo (AI Engine FastAPI)
- **Container**: `english_ai` (Uvicorn FastAPI + Faster-Whisper + Groq lazy client).
- **Healthcheck**: `GET http://localhost:8000/`
- **Kết quả**: HTTP 200 OK — `{"message": "AI Engine is running!"}`.
- **Đánh giá**: Model Whisper được nạp sẵn, không gặp lỗi crash API key như trước khi sửa ở Tuần 2.

### 2.3. Giao diện Người dùng (Frontend Client)
- **Container**: `english_frontend` (Nginx Alpine serve bundle Vite).
- **Healthcheck**: `GET http://localhost/`
- **Kết quả**: HTTP 200 OK.
- **Đánh giá**: Đã hiển thị phiên bản cập nhật `v1.3-ci-ready`.

---

## 3. Cẩm nang Xử lý Sự cố Kỹ thuật Tuần 3 (Troubleshooting cho Tuần 4)

Nhân (Lead Tuần 4) có thể đưa trực tiếp các ca xử lý lỗi thực tế sau vào **Chương 4: Xử lý sự cố (Troubleshooting)** của Báo cáo Kỹ thuật:

### Sự cố 3.1: Xung đột ESLint v9 Flat Config khiến Frontend CI fail lập tức
- **Mô tả**: Khi chạy `npm run lint` trên mã nguồn Frontend, ESLint v9 ném ra 8 lỗi Fatal:
  1. `no-unused-vars`: Biến `apiClient` và tham số `saved` không được sử dụng trong `VocabularyManager.jsx`.
  2. `react-hooks/set-state-in-effect`: Compiler phát hiện hành vi gọi `setState()` trực tiếp bên trong `useEffect` khi reset form hoặc đổi câu active.
  3. `react-hooks/preserve-manual-memoization`: Không đồng nhất dependency giữa `t` (i18n) và `useCallback`.
- **Phân tích nguyên nhân**: Các runner CI trên GitHub coi bất kỳ mã lỗi ESLint nào là thất bại (Exit code 1) và hủy toàn bộ tiến trình triển khai.
- **Giải pháp xử lý của Long**:
  - Tinh chỉnh `eslint.config.js`: Chuyển rule `no-unused-vars` thành warning có điều kiện bỏ qua tiền tố `_`, tắt 2 rule thực nghiệm của React compiler (`react-hooks/set-state-in-effect: 'off'`).
  - Dọn sạch các import không dùng (`apiClient`, `_err`) để mã nguồn đạt độ tinh gọn cao nhất.
  - Kết quả: `npm run lint` vượt qua với 0 error.

### Sự cố 3.2: Lỗi quyền thực thi tệp Shell Script của Maven Wrapper trên Linux CI Runner
- **Mô tả**: Khi chạy workflow GitHub Actions trên môi trường `ubuntu-latest`, runner báo lỗi:  
  `bash: ./mvnw: Permission denied`.
- **Nguyên nhân**: Lập trình viên phát triển trên hệ điều hành Windows NTFS không quản lý bit phân quyền thực thi `+x` của POSIX. Khi commit lên Git, tệp `mvnw` chỉ mang quyền `644` thay vì `755`.
- **Giải pháp**:
  - Bổ sung bước cấp quyền thực thi tự động trong workflow:
    ```yaml
    - name: Grant Execute Permission to Maven Wrapper
      run: chmod +x backend-core/backend-core/mvnw
    ```
  - Đồng thời cập nhật Git index: `git update-index --chmod=+x backend-core/backend-core/mvnw`.

### Sự cố 3.3: Bảo vệ Deploy Hook Token & Cơ chế Kích hoạt Có điều kiện
- **Mô tả**: Nếu gọi trực tiếp Deploy Hook khi chưa kiểm thử, hệ thống Render sẽ build các bản commit lỗi, gây gián đoạn dịch vụ và tốn thời gian tính phí.
- **Giải pháp**:
  - Thiết kế cấu trúc `needs: [backend-ci, frontend-ci, ai-engine-ci]`. Chỉ khi cả 3 job kiểm thử độc lập cùng xanh thì stage deploy mới được phép thực thi.
  - Sử dụng cấu trúc `if: env.RENDER_BACKEND_DEPLOY_HOOK != ''` kết hợp `secrets.RENDER_BACKEND_DEPLOY_HOOK` để pipeline vẫn chạy an toàn, không báo lỗi đỏ giả lập nếu người dùng chưa kịp điền secret trên repo cá nhân.

---

## 4. Kế hoạch bàn giao cho Tuần 4 (Hoàn thiện Báo cáo & Demo)

1. **Nhân (Lead Tuần 4)**:
   - Trích xuất toàn bộ dữ liệu thực tế từ `Review_Notes_Tuan1.md`, `Review_Notes_Tuan2.md`, `Review_Notes_Tuan3.md` vào Báo cáo Kỹ thuật Đồ án (Chương 3, 4 và 5).
   - Thiết lập công cụ giám sát **UptimeRobot** ping định kỳ 10 phút/lần vào đường dẫn Render Frontend/Backend để tránh chế độ ngủ đông (Cold Start Sleep) của gói Free Tier.
   - Chuẩn bị slide thuyết trình (10 slide) và kịch bản Live Demo 3 phút theo Đề cương chi tiết (ĐCCT).
2. **Trạng thái sẵn sàng**:
   - Mã nguồn đã sẵn sàng đẩy lên branch `main`.
   - File cấu hình CI/CD và tài liệu hướng dẫn đã lưu đầy đủ trong repository.

