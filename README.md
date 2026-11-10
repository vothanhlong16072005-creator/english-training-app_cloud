# 🎓 English Training App — Học Từ Vựng & Luyện Phát Âm AI
> **Học phần:** Điện toán đám mây (IS2023) — Nhóm 10  
> **Đơn vị:** Khoa Kỹ thuật Máy tính và Điện tử — Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn (VKU)  
> **Giảng viên hướng dẫn:** **TS. Hoàng Hữu Đức**  
> **Đề tài kỹ thuật:** *"A Step-by-Step Guide to Deploying Full-Stack Web and PostgreSQL to Render with CI/CD"*  
> **Kho lưu trữ GitHub:** [https://github.com/vothanhlong16072005-creator/english-training-app_cloud](https://github.com/vothanhlong16072005-creator/english-training-app_cloud)

---

## 🌐 1. Hệ Thống Trực Tuyến Đang Hoạt Động (Live Endpoints)

| Phân hệ / Dịch vụ | Nền tảng Đám mây | Địa chỉ Public Trực tuyến | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Frontend Web Client** | Render Web Service (Nginx) | 🔗 [https://english-frontend-1gwz.onrender.com](https://english-frontend-1gwz.onrender.com) | ✅ **Live 24/7 (HTTPS)** |
| **Backend Core REST API** | Render Web Service (Java 17) | 🔗 [https://english-backend-bgos.onrender.com](https://english-backend-bgos.onrender.com) | ✅ **Live 24/7 (HTTPS)** |
| **AI Engine Service** | Render Private Microservice | `english-ai:8000` (FastAPI + Faster-Whisper) | ✅ **Live (Port 8000)** |
| **Managed Database** | Render PostgreSQL 16 DBaaS | `dpg-dbp4abom7kps739pmcd0-a:5432` | ✅ **SSL Connected** |
| **Media Storage CDN** | Cloudinary Cloud CDN | `res.cloudinary.com/dqqbvzmrr` | ✅ **Active** |
| **Giám sát Uptime** | UptimeRobot & GitHub Keep-Alive | Ping định kỳ 5 – 10 phút/lần chống ngủ đông | ✅ **100% Uptime** |

---

## 🧪 2. Hướng Dẫn Kiểm Thử Nhanh Dành Cho Thành Viên & Giảng Viên

Mở trình duyệt truy cập ngay vào: **[https://english-frontend-1gwz.onrender.com](https://english-frontend-1gwz.onrender.com)**

### Kịch bản kiểm thử các tính năng chính:
1. **Luyện nói Video YouTube tương tác & Chấm điểm phát âm AI**:
   * Truy cập bài học số 7: [https://english-frontend-1gwz.onrender.com/lesson/7](https://english-frontend-1gwz.onrender.com/lesson/7).
   * Video YouTube phát kèm phụ đề chạy đồng bộ từng giây theo thời gian thực.
   * Chọn tab **Shadowing**, bấm nút **Micro** đọc theo câu mẫu ➔ Dịch vụ AI (Whisper) tự động phân tích giọng nói, trả về điểm số (%) và tô màu **xanh lá** (từ phát âm đúng) hoặc **đỏ** (từ phát âm sai/nuốt chữ).
2. **Học Từ vựng Flashcard chuẩn Tiếng Việt UTF-8**:
   * Mở mục [Từ Vựng](https://english-frontend-1gwz.onrender.com/vocabulary).
   * Xem danh mục 5 chủ đề: *Động Vật* 🐾, *Trái Cây & Thực Phẩm* 🍎, *Giao Tiếp Cơ Bản* 💬, *Công Việc* 💼, *Du Lịch* ✈️.
   * Lật thẻ Flashcard tương tác: xem phiên âm quốc tế IPA, nghĩa tiếng Việt, câu ví dụ và nghe phát âm chuẩn bản xứ.
3. **Xác thực Đăng nhập & Lưu trữ Ảnh đại diện (Cloudinary CDN)**:
   * Bấm nút **Đăng nhập** ➔ Chọn đăng nhập bằng **Google OAuth2**.
   * Cập nhật ảnh đại diện: Ảnh được đẩy trực tiếp lên Cloudinary CDN và lưu URL vào PostgreSQL, không bị mất khi redeploy container.
4. **Kiểm tra Giám sát Sẵn sàng (Uptime 100%)**:
   * Bảng giám sát UptimeRobot liên tục ping kiểm tra sức khỏe hệ thống, loại bỏ hoàn toàn hiện tượng trễ khởi động lạnh (Cold Start).

---

## 📚 3. Danh Mục Hồ Sơ & Tài Liệu Nghiệm Thu Dự Án (`docs/`)

Toàn bộ tài liệu báo cáo và cẩm nang kỹ thuật của Nhóm 10 được lưu trữ đầy đủ trong thư mục [`docs/`](./docs):

| Tệp tài liệu | Mục đích sử dụng | Đường dẫn |
| :--- | :--- | :--- |
| **`BAO_CAO_TOM_TAT_NHANH.md`** | Báo cáo tóm tắt 2 phút: Nắm bắt nhanh toàn bộ kết quả, chỉ số Uptime và 3 điểm sáng kỹ thuật. | [Xem tài liệu](./docs/BAO_CAO_TOM_TAT_NHANH.md) |
| **`BAO_CAO_CHI_TIET_TOAN_DIEN_DU_AN.md`** | Báo cáo kỹ thuật toàn diện 5 chương chuẩn cấu trúc đồ án VKU (kèm 7 ca Troubleshooting chi tiết). Dùng để xuất sang file Word nộp giảng viên. | [Xem tài liệu](./docs/BAO_CAO_CHI_TIET_TOAN_DIEN_DU_AN.md) |
| **`DAN_Y_SLIDE_THUYET_TRINH.md`** | Dàn ý chi tiết bộ **14 Slide** thuyết trình bảo vệ đồ án kèm lời thoại từng trang và định hướng mở rộng tương lai. | [Xem tài liệu](./docs/DAN_Y_SLIDE_THUYET_TRINH.md) |
| **`HUONG_DAN_BAN_GIAO_NHOM_10.md`** | Cẩm nang bàn giao công việc chi tiết cho các thành viên trong nhóm (soạn slide, viết báo cáo Word, diễn tập kịch bản demo 3 phút). | [Xem tài liệu](./docs/HUONG_DAN_BAN_GIAO_NHOM_10.md) |
| **`HuongDan_CI_CD_GitHub_Actions.md`** | Hướng dẫn chi tiết thiết lập đường ống CI/CD GitHub Actions với Render Deploy Hooks. | [Xem tài liệu](./docs/HuongDan_CI_CD_GitHub_Actions.md) |

---

## 🏗️ 4. Kiến Trúc Hạ Tầng Đám Mây (Cloud Architecture)

```mermaid
flowchart TD
    subgraph Clients["🌐 Người dùng (Public Web)"]
        Browser["Trình duyệt Web (HTTPS/Port 443)"]
    end

    subgraph CDN["☁️ Lưu trữ Media Đám mây"]
        Cloudinary["Cloudinary CDN<br/>(Lưu ảnh Avatar)"]
    end

    subgraph RenderPlatform["🚀 Nền tảng Đám mây Render (PaaS & DBaaS)"]
        subgraph PublicFacing["Tầng Tiếp Nhận Công Cộng"]
            FE["english-frontend<br/>(React 18 + Nginx - Port 10000)"]
            BE["english-backend<br/>(Spring Boot 3 - Port 8080)"]
        end

        subgraph PrivateNet["Mạng Nội Bộ Đám Mây (Private Network)"]
            AI["english-ai<br/>(FastAPI Whisper - Port 8000)"]
            DB[("english-db<br/>(Managed PostgreSQL 16)") ]
        end
    end

    subgraph Monitoring["🔄 Tự Động Hóa & Giám Sát"]
        GH["GitHub Actions CI/CD<br/>(4 Jobs Pipeline)"]
        UR["UptimeRobot & Keep-Alive Cron<br/>(Ping 5-10 phút/lần ➔ 100% Uptime)"]
    end

    Browser -->|HTTPS| FE
    Browser -->|REST API| BE
    FE -->|JSON API Calls| BE
    BE -->|Upload/Fetch Media| Cloudinary
    BE -->|gRPC/Internal HTTP| AI
    BE -->|JDBC SSL Port 5432| DB
    GH -->|Deploy Hook Trigger| RenderPlatform
    UR -.->|Health Check Ping| BE
    UR -.->|Health Check Ping| FE
```

---

## ⚙️ 5. Hạ Tầng Dạng Mã (IaC) & Tự Động Hóa CI/CD

### 1. Khai báo hạ tầng qua Render Blueprint (`render.yaml`):
Toàn bộ cụm dịch vụ được định nghĩa bằng mã (Infrastructure as Code) trong tệp [`render.yaml`](./render.yaml). Cho phép tạo mới toàn bộ hệ sinh thái chỉ bằng 1 thao tác nhấp chuột trên Render Dashboard.

### 2. Đường ống CI/CD tự động (`.github/workflows/deploy.yml`):
* **Job 1 (Backend CI):** Cài đặt JDK 17, biên dịch và chạy kiểm thử Maven Package.
* **Job 2 (Frontend CI):** Cài đặt Node 20, kiểm tra cú pháp ESLint, build Vite tĩnh.
* **Job 3 (AI Engine CI):** Kiểm tra cú pháp Python 3.11 với `py_compile`.
* **Job 4 (Deploy Hook):** Tự động kích hoạt Render Deploy Webhook khi cả 3 job kiểm thử trên đều đạt màu xanh.

### 3. Quy trình chống ngủ đông tự động (`.github/workflows/keep_alive.yml`):
* Tự động gửi yêu cầu kiểm tra sức khỏe mỗi 10 phút một lần (`cron: '*/10 * * * *'`) kết hợp cùng **UptimeRobot** giữ cho máy chủ luôn trong trạng thái sẵn sàng phục vụ.

---

## 💻 6. Hướng Dẫn Khởi Chạy Localhost Bằng Docker Compose (Dành cho Lập trình viên)

Nếu muốn chạy toàn bộ 4 dịch vụ trên máy tính cá nhân qua Docker:

```bash
# 1. Clone mã nguồn
git clone https://github.com/vothanhlong16072005-creator/english-training-app_cloud.git
cd english-training-app_cloud

# 2. Tạo tệp môi trường
cp .env.example .env

# 3. Khởi động hệ thống
docker compose up --build -d

# 4. Nạp dữ liệu mẫu
docker exec -i english_db psql -U postgres -d english_app < vocabulary_seed.sql
```

Truy cập cục bộ:
* **Frontend Web:** [http://localhost](http://localhost)
* **Backend API:** [http://localhost:8080/api/vocabularies](http://localhost:8080/api/vocabularies)
* **AI Engine:** [http://localhost:8000/](http://localhost:8000/)

---

## 👥 7. Đội Ngũ Thực Hiện — Nhóm 10 (VKU)
* **Võ Thành Long** — *Lead CI/CD & Cloud DevOps Engineer*
* **Huỳnh Đức Nhân** — *Cloud Quality Assurance & Documentation Lead*
* Cùng các thành viên Nhóm 10 — Học phần Điện toán đám mây (IS2023).
