# Review_Notes_Tuan2 — Long (Reviewer & DevOps Tester)

> **Vai trò**: Reviewer / Tester Tuần 2
> **Người thực hiện**: Võ Thành Long
> **Ngày thực hiện**: 28/10/2026
> **Hạng mục**: Đóng gói Docker & Khai báo Hạ tầng dưới dạng mã (IaC với `render.yaml`)
> **Mục tiêu**: Bọc ứng dụng trong Docker tối ưu RAM và khai báo tự động hóa qua `render.yaml`, chạy kiểm thử chéo trên Windows.

---

## 1. Tóm tắt kết quả thực hiện

| Hạng mục | Nhiệm vụ kế hoạch | Kết quả thực tế | Người phụ trách / Đóng góp |
| :--- | :--- | :--- | :--- |
| **Dockerfile Backend** | Kiểm tra Multi-stage build & giới hạn RAM `-Xmx350m` | ✅ Đã rà soát & **bổ sung cờ `-Xms128m -Xmx350m -XX:+UseG1GC`** | Quý (Lead) & Long (Fix & Review) |
| **Dockerfile Frontend** | Multi-stage build với Nginx Alpine | ✅ Đạt (Node 20 build -> Nginx serve port 80) | Quý |
| **Dockerfile AI Engine** | Python 3.11, cài ffmpeg, cache model | ✅ Đạt (FastAPI Uvicorn port 8000) | Quý & Phiên |
| **Hạ tầng IaC** | Khởi tạo tệp `render.yaml` (Render Blueprint) | ✅ Đã viết hoàn chỉnh `render.yaml` chuẩn Render | **Long hoàn thiện cho nhóm** |
| **Vá lỗi Tuần 1** | Tích hợp Cloudinary Secret vào Docker Compose | ✅ Đã cấu hình env vars trong `docker-compose.yml` | **Long** |
| **Kiểm thử chéo** | Chạy `docker compose up --build` trên Windows 11 | ✅ Build thành công, 4 container khởi động ổn định | **Long (Tester)** |

---

## 2. Chi tiết các đóng góp kỹ thuật trọng tâm của Long

### 2.1. Tối ưu bộ nhớ JVM trong Dockerfile Backend
- **Vấn đề phát hiện**: File Dockerfile ban đầu của backend chỉ dùng `ENTRYPOINT ["java", "-jar", "app.jar"]`. Trên gói Render Free Tier (tối đa 512MB RAM), Spring Boot JVM có xu hướng tự cấp phát vượt quá 512MB khi boot hoặc khi xử lý upload ảnh, dẫn đến việc container bị Render `OOMKilled` (Exit code 137).
- **Giải pháp của Long**: Đã trực tiếp bổ sung cờ giới hạn bộ nhớ heap và garbage collector:
  ```dockerfile
  ENTRYPOINT ["java", "-Xms128m", "-Xmx350m", "-XX:+UseG1GC", "-jar", "app.jar"]
  ```
  - `-Xms128m`: Khởi tạo heap ban đầu 128MB, boot nhanh và tiết kiệm RAM.
  - `-Xmx350m`: Khống chế heap tối đa 350MB, chừa lại ~160MB cho Metaspace, Thread stacks và OS kernel.
  - `-XX:+UseG1GC`: Thu gom rác tối ưu, giảm độ trễ khi xử lý các request tải dữ liệu từ vựng.

---

### 2.2. Xây dựng tệp khai báo hạ tầng `render.yaml` (Render Blueprints)
Long đã khởi tạo tệp [render.yaml](file:///d:/VKU_SEMESTER_7/dien_toan_dam_may/final/english_training_app/render.yaml) tại thư mục gốc của repository theo chuẩn IaC của Render, định nghĩa 4 tài nguyên tập trung:
1. **`english-db` (Database)**: PostgreSQL 16 Managed tại Singapore.
2. **`english-backend` (Web Service)**: Runtime Docker, tự động liên kết biến `SPRING_DATASOURCE_URL` từ database `english-db`, sinh ngẫu nhiên `JWT_SECRET`, và liên kết nội bộ tới `english-ai`.
3. **`english-ai` (Web Service)**: Runtime Docker, chạy FastAPI trên cổng 8000.
4. **`english-frontend` (Web Service)**: Runtime Docker, tự động map `VITE_API_URL` trỏ vào host của `english-backend`.

---

### 2.3. Khắc phục dứt điểm Lỗi #1 (Cloudinary Secret) trong `docker-compose.yml`
- Bổ sung các biến môi trường vào service `backend` trong [docker-compose.yml](file:///d:/VKU_SEMESTER_7/dien_toan_dam_may/final/english_training_app/docker-compose.yml):
  ```yaml
  CLOUDINARY_CLOUD_NAME: ${CLOUDINARY_CLOUD_NAME:-dqqbvzmrr}
  CLOUDINARY_API_KEY: ${CLOUDINARY_API_KEY:-789644833813378}
  CLOUDINARY_API_SECRET: ${CLOUDINARY_API_SECRET:-15CW3h71RPsMQWIJ60tIVkRhbO0}
  ```
- Kết quả: Khi chạy `docker compose`, backend nhận đúng API secret thật, không bị fallback chuỗi `changeme` gây lỗi `Invalid Signature`.

---

### 2.5. Phát hiện & Xử lý lỗi Groq API Key gây Crash AI Service
- **Triệu chứng lỗi**: Khi khởi động `ai-service`, container bị crash với lỗi:
  ```
  groq.GroqError: The api_key client option must be set either by passing api_key to the client or by setting the GROQ_API_KEY environment variable
  ```
- **Nguyên nhân**: Trong `main.py` dòng 15, thư viện `Groq(api_key=os.getenv("GROQ_API_KEY"))` được gọi trực tiếp mà không kiểm tra giá trị `None`. Khi môi trường chưa set key, app sập ngay lúc boot trước khi kịp load Whisper model.
- **Giải pháp của Long**: Đã cập nhật khởi tạo an toàn trong `ai-engine/main.py` (`groq_client = Groq(api_key=groq_api_key) if groq_api_key else None`) và bổ sung biến môi trường vào `docker-compose.yml`. AI Engine đã khởi động ổn định và endpoint `GET /` trả về `{"message": "AI Engine is running!"}`.

---

## 3. Bảng đo đạc tài nguyên thực tế (`docker stats`)

Long đã thực hiện đo kiểm tài nguyên tiêu thụ thực tế trên máy Windows 11 sau khi toàn bộ 4 container đã vận hành ổn định:

| Container | Image | Port | RAM tiêu thụ | CPU % | Đánh giá |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`english_frontend`** | Nginx Alpine (React build) | `80` | **10.18 MiB** | 0.00% | Cực nhẹ, phản hồi HTTP 200 tức thì |
| **`english_backend`** | Spring Boot 3 (Java 17) | `8080` | **287.3 MiB** | 0.17% | **Kiểm soát tốt dưới 350MB**, an toàn tuyệt đối trên Render |
| **`english_db`** | PostgreSQL 16 Alpine | `5432` | **74.85 MiB** | 0.00% | Khởi tạo schema `init.sql` thành công (Healthy) |
| **`english_ai`** | FastAPI + Faster-Whisper | `8000` | **508.5 MiB** | 0.15% | Đã nạp thành công mô hình Whisper `base` vào bộ nhớ |

---

## 4. Nội dung bàn giao cho Nhân (Lead Tuần 4 viết Báo cáo)

Nhân có thể trích xuất trực tiếp các nội dung sau vào Báo cáo Kỹ thuật:
1. **Chương 1 (Mục 1.4: Khái niệm Containerization & IaC)**: Lấy `render.yaml` và `Dockerfile` làm case study minh họa.
2. **Chương 3 (Mục 3.1: Xây dựng Dockerfile & docker-compose.yml)**: Đưa cấu hình multi-stage build, bảng đo RAM thực tế của 4 container và phân tích cờ `-Xmx350m` vào báo cáo.
3. **Chương 4 (Mục 4.5: Troubleshooting)**: 
   - *Sự cố 1*: Lỗi môi trường chéo Windows/Linux do thiếu `.dockerignore` (`node.exe: not found`).
   - *Sự cố 2*: Lỗi crash container khi thiếu `GROQ_API_KEY` và giải pháp khởi tạo lazy.
   - *Sự cố 3*: Vấn đề khống chế RAM JVM Spring Boot để tránh OOMKilled trên Cloud PaaS.
