# English Training App — Học Từ Vựng & Luyện Phát Âm AI
> **Học phần:** Điện toán đám mây (IS2023) — Nhóm 10  
> **Đơn vị:** Khoa Kỹ thuật Máy tính và Điện tử — Trường Đại học CNTT & TT Việt - Hàn (VKU)  
> **Giảng viên hướng dẫn:** TS. Hoàng Hữu Đức  
> **Đề tài kỹ thuật:** *"A Step-by-Step Guide to Deploying Full-Stack Web and PostgreSQL to Render with CI/CD"*  
> **Repository chính thức:** [https://github.com/vothanhlong16072005-creator/english-training-app_cloud](https://github.com/vothanhlong16072005-creator/english-training-app_cloud)

---

## 📌 1. Giới thiệu Tổng quan

**English Training App** là hệ thống Web thương mại/học tập trực tuyến đa tầng (Full-Stack Cloud Application), đóng vai trò Case Study thực nghiệm cho đề tài kỹ thuật triển khai đám mây PaaS/DBaaS Render.

### Tech Stack cốt lõi:
- **Frontend Client:** React 18, Vite, TailwindCSS, Axios, đa ngôn ngữ i18n, chạy trên máy chủ **Nginx Alpine**.
- **Backend Core:** Java Spring Boot 3, Java 17, Spring Data JPA, Spring Security, JWT Auth.
- **AI Engine:** Python 3.11, FastAPI, Uvicorn, Faster-Whisper (nhận diện giọng nói offline), tích hợp Groq API.
- **Cloud Database (DBaaS):** PostgreSQL 16 Managed trên nền tảng Render (Singapore) kết nối an toàn qua SSL.
- **Cloud Object Storage:** Cloudinary SDK giải quyết bài toán hệ thống file phi trạng thái (*Ephemeral Storage*) trên PaaS.
- **DevOps & IaC:** Docker Multi-stage, Docker Compose, Render Blueprints (`render.yaml`), GitHub Actions CI/CD Pipeline.

---

## 🏗️ 2. Kiến trúc Hệ thống & Cổng Dịch vụ (Ports)

| Dịch vụ (Service) | Công nghệ | Container Name | Port Docker | Port Local Dev | Mô tả chức năng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Frontend** | React 18 + Nginx | `english_frontend` | `http://localhost:80` | `http://localhost:5173` | Giao diện người dùng Web SPA |
| **Backend** | Spring Boot 3 | `english_backend` | `http://localhost:8080` | `http://localhost:8080` | API nghiệp vụ, Auth, CRUD, Upload |
| **AI Engine** | FastAPI + Whisper | `english_ai` | `http://localhost:8000` | `http://localhost:8000` | Chấm điểm phát âm & STT |
| **Database** | PostgreSQL 16 | `english_db` | `localhost:5432` | `localhost:5432` | Lưu trữ dữ liệu quan hệ |

---

## 🚀 3. Hướng dẫn Khởi chạy Nhanh bằng Docker (Khuyên dùng)

> [!TIP]
> Đây là cách nhanh nhất và chuẩn nhất dành cho tất cả thành viên trong nhóm và người chấm thi để chạy đồng nhất cả 4 service mà không cần cài JDK, Node.js hay Python.

### Yêu cầu tiên quyết:
- Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/) (hỗ trợ Windows / macOS / Linux) và đã bật Docker.

### Bước 1: Clone Repository
```bash
git clone https://github.com/vothanhlong16072005-creator/english-training-app_cloud.git
cd english-training-app_cloud
```

### Bước 2: Tạo tệp cấu hình môi trường
Sao chép tệp mẫu `.env.example` thành `.env` (các giá trị mặc định đã được nhóm cấu hình sẵn):
```bash
# Trên Windows PowerShell
Copy-Item .env.example .env

# Trên Linux / macOS
cp .env.example .env
```

### Bước 3: Build và Khởi động toàn bộ hệ thống
```bash
docker compose up --build -d
```

### Bước 4: Nạp Dữ liệu mẫu (Seeding Database)
Sau khi các container khởi động, nạp bộ từ vựng và chủ đề tiếng Anh vào database:
```bash
# Trên Windows PowerShell
Get-Content vocabulary_seed.sql -Raw | docker exec -i english_db psql -U postgres -d english_app

# Trên Linux / macOS / Git Bash
docker exec -i english_db psql -U postgres -d english_app < vocabulary_seed.sql
```

### Bước 5: Truy cập ứng dụng
- **Giao diện Web:** Mở trình duyệt truy cập: [http://localhost](http://localhost)
- **Kiểm tra API Backend:** [http://localhost:8080/api/vocabularies](http://localhost:8080/api/vocabularies)
- **Kiểm tra AI Service:** [http://localhost:8000/](http://localhost:8000/) *(Phản hồi `{"message": "AI Engine is running!"}`)*
- **Kiểm tra tài nguyên:** `docker stats` (Toàn bộ 4 container chỉ tiêu tốn ~850MB RAM tổng).

### Dừng hệ thống:
```bash
docker compose down
```

---

## 💻 4. Hướng dẫn Chạy Local Từng Service (Dành cho Lập trình viên)

Dành cho thành viên nhóm muốn chỉnh sửa mã nguồn và debug từng phần mà không muốn chạy container.

### 4.1. Khởi động CSDL PostgreSQL
Bạn có thể tận dụng Docker chỉ để chạy DB:
```bash
docker compose up -d db
```
Hoặc cài PostgreSQL 16 cục bộ, tạo database `english_app`, rồi chạy script [init.sql](file:///d:/VKU_SEMESTER_7/dien_toan_dam_may/final/english_training_app/init.sql) và [vocabulary_seed.sql](file:///d:/VKU_SEMESTER_7/dien_toan_dam_may/final/english_training_app/vocabulary_seed.sql).

---

### 4.2. Khởi chạy Backend Core (Spring Boot 3)
**Yêu cầu:** JDK 17+ và Maven.
```bash
cd backend-core/backend-core

# Windows PowerShell:
.\mvnw.cmd spring-boot:run

# Linux / macOS:
chmod +x mvnw
./mvnw spring-boot:run
```
> Server sẽ lắng nghe tại cổng `http://localhost:8080`.

---

### 4.3. Khởi chạy AI Engine (FastAPI)
**Yêu cầu:** Python 3.10 hoặc 3.11 và FFmpeg.
```bash
cd ai-engine

# 1. Tạo môi trường ảo
python -m venv .venv

# 2. Kích hoạt môi trường ảo:
# Trên Windows:
.venv\Scripts\activate
# Trên Linux/macOS:
source .venv/bin/activate

# 3. Cài đặt thư viện:
pip install --upgrade pip
pip install -r requirements.txt

# 4. Khởi chạy server:
uvicorn main:app --reload --port 8000
```
> Server sẽ lắng nghe tại cổng `http://localhost:8000`.

---

### 4.4. Khởi chạy Frontend Client (React + Vite)
**Yêu cầu:** Node.js 18+ và npm.
```bash
cd frontend-client

# 1. Cài đặt dependencies
npm install

# 2. Kiểm tra chất lượng code (Lint)
npm run lint

# 3. Chạy môi trường phát triển (Hot reload)
npm run dev
```
> Mở trình duyệt tại địa chỉ: `http://localhost:5173`.

---

## 🔐 5. Danh mục Biến Môi Trường (Environment Variables)

| Tên biến | Giá trị mặc định | Giải thích |
| :--- | :--- | :--- |
| `DB_NAME` | `english_app` | Tên cơ sở dữ liệu PostgreSQL |
| `DB_USER` | `postgres` | Tài khoản quản trị DB |
| `DB_PASSWORD` | `postgres` | Mật khẩu DB |
| `JWT_SECRET` | *(chuỗi bảo mật 256-bit)* | Khóa bí mật ký JWT Token đăng nhập |
| `CLOUDINARY_CLOUD_NAME` | `dqqbvzmrr` | Cloud name tài khoản Cloudinary nhóm |
| `CLOUDINARY_API_KEY` | `789644833813378` | Public API Key của Cloudinary |
| `CLOUDINARY_API_SECRET` | *(cung cấp nội bộ nhóm)* | Secret Key xác thực upload ảnh avatar |
| `GROQ_API_KEY` | *(tùy chọn)* | API key mô hình LLM hỗ trợ giải thích từ |

---

## 🔄 6. Quy trình CI/CD & Triển khai Lên Đám Mây Render

Dự án áp dụng tự động hóa hoàn toàn với **GitHub Actions** và **Render Deploy Hooks**:

```
[git push origin main] 
       │
       ▼
 ┌────────────────────────────────────────────────────────┐
 │            GitHub Actions (.github/workflows/deploy.yml)│
 ├────────────────────────────────────────────────────────┤
 │ 1. Backend CI    : Maven compile, check & package JAR  │
 │ 2. Frontend CI   : Node.js 20, ESLint check & Vite build│
 │ 3. AI Engine CI  : Python 3.11 bytecode py_compile     │
 └────────────────────────────┬───────────────────────────┘
                              │
                    (Tất cả Job báo xanh ✅)
                              │
                              ▼
 ┌────────────────────────────────────────────────────────┐
 │ CD Stage: Kích hoạt Render Deploy Hooks an toàn qua    │
 │ GitHub Secrets (Zero-Downtime Rolling Update)          │
 └────────────────────────────────────────────────────────┘
```

- **Định nghĩa hạ tầng đám mây:** Tệp [render.yaml](file:///d:/VKU_SEMESTER_7/dien_toan_dam_may/final/english_training_app/render.yaml) định nghĩa trọn vẹn 3 Web Services và 1 Managed PostgreSQL Database tại region `singapore`.
- **Hướng dẫn CI/CD chi tiết:** Xem tại [docs/HuongDan_CI_CD_GitHub_Actions.md](file:///d:/VKU_SEMESTER_7/dien_toan_dam_may/final/english_training_app/docs/HuongDan_CI_CD_GitHub_Actions.md).

---

## 📂 7. Thư viện Tài liệu Kỹ thuật Đồ án (`docs/`)

Toàn bộ tài liệu báo cáo, đề cương và cẩm nang kỹ thuật của nhóm được lưu trữ tại thư mục `docs/`:

- 📘 **`docs/HuongDan_CI_CD_GitHub_Actions.md`**: Hướng dẫn chi tiết thiết lập GitHub Actions và Deploy Hooks sang Render.
- 📘 **`docs/HuongDan_PostgreSQL_Cloudinary.docx`**: Hướng dẫn cấu hình kết nối Cloud PostgreSQL và Cloudinary SDK.
- 📋 **`docs/Review_Notes_Tuan1.md`**: Nhật ký kiểm thử dữ liệu & upload avatar Tuần 1.
- 📋 **`docs/Review_Notes_Tuan2.md`**: Nhật ký kiểm thử Docker, đo RAM và xử lý OOMKilled Tuần 2.
- 📋 **`docs/Review_Notes_Tuan3.md`**: Nhật ký kiểm thử CI/CD, chuẩn hóa ESLint và bàn giao Tuần 3.
- 📑 **`docs/iCloud(3)_group 10_ĐCCT.docx`**: Đề cương chi tiết đồ án chính thức (VKU).
- 📑 **`docs/kế hoạch làm dự án.docx`**: Bảng phân công công việc chi tiết theo 4 tuần.

---

## 👥 8. Thành viên Nhóm & Phân công Trách nhiệm

| Thành viên | Vai trò Kỹ thuật | Trọng tâm công việc |
| :--- | :--- | :--- |
| **Nguyễn Văn Phiên** | Technical Lead (Tuần 1) | Khởi tạo PostgreSQL Cloud, tích hợp Cloudinary SDK |
| **Ngô Văn Quý** | Technical Lead (Tuần 2) | Đóng gói Docker multi-stage, tối ưu RAM JVM, viết `render.yaml` |
| **Võ Thành Long** | Technical Lead (Tuần 3) | Tự động hóa CI/CD GitHub Actions, chuẩn hóa mã nguồn, nghiệm thu |
| **Lê Trọng Nhân** | Technical Lead (Tuần 4) | Tổng hợp Báo cáo kỹ thuật cuối kỳ, thiết lập UptimeRobot, Slide Demo |
