# HƯỚNG DẪN BÀN GIAO DỰ ÁN — NHÓM 10
## HỌC PHẦN: ĐIỆN TOÁN ĐÁM MÂY (IS2023) — TS. HOÀNG HỮU ĐỨC

---

### 1. BẢNG THÔNG TIN TRUY CẬP HỆ THỐNG TRỰC TUYẾN

| Hạng mục | Đường dẫn truy cập (Public URL) | Ghi chú vận hành |
| :--- | :--- | :--- |
| **Website chính thức** | [https://english-frontend-1gwz.onrender.com](https://english-frontend-1gwz.onrender.com) | Hoạt động 24/7 với HTTPS, giao diện học tập. |
| **Backend REST API** | [https://english-backend-bgos.onrender.com](https://english-backend-bgos.onrender.com) | Spring Boot 3 API Swagger/Health. |
| **Mã nguồn GitHub** | [english-training-app_cloud (GitHub)](https://github.com/vothanhlong16072005-creator/english-training-app_cloud) | Nhánh `main`, tự động CI/CD. |
| **Bảng giám sát Uptime** | [UptimeRobot Dashboard](https://uptimerobot.com) | Chỉ số sẵn sàng **100% Uptime**, ping 5 phút/lần. |

---

### 2. PHÂN CHIA TÀI LIỆU CHO CÁC THÀNH VIÊN TRONG NHÓM

#### 👤 Dành cho thành viên Viết Báo Cáo Kỹ Thuật (File Word):
* Mở tệp: [`docs/BAO_CAO_CHI_TIET_TOAN_DIEN_DU_AN.md`](file:///d:/VKU_SEMESTER_7/dien_toan_dam_may/final/docs/BAO_CAO_CHI_TIET_TOAN_DIEN_DU_AN.md).
* **Nhiệm vụ**: Copy toàn bộ 5 chương sang tệp mẫu Word của VKU:
  * *Chương 1*: Bối cảnh, mục tiêu và phân công 4 tuần.
  * *Chương 2*: Sơ đồ kiến trúc Mermaid, giải pháp Stateless CDN Cloudinary, cấu hình JVM `-Xmx350m -XX:+UseG1GC`, tệp IaC `render.yaml`.
  * *Chương 3*: Các bước triển khai thực nghiệm từ Tuần 1 đến Tuần 4.
  * *Chương 4 (Trọng tâm)*: 7 ca xử lý sự cố thực tế (Troubleshooting Guide) kèm code minh họa.
  * *Chương 5*: Bảng kiểm nghiệm, bảng hạch toán chi phí 0 VNĐ/tháng và kết luận.
* Chèn thêm ảnh chụp màn hình UptimeRobot 100% và ảnh Render Blueprint 4 dịch vụ màu xanh.

---

#### 👤 Dành cho thành viên Thiết Kế Slide Thuyết Trình (10 Slide):
Soạn slide trên PowerPoint / Canva theo cấu trúc 10 trang chuẩn mực:

* **Slide 1: Trang tiêu đề**:
  * Tên đề tài: *A Step-by-Step Guide to Deploying Full-Stack Web and PostgreSQL to Render with CI/CD*.
  * GVHD: TS. Hoàng Hữu Đức — Nhóm thực hiện: Nhóm 10.
* **Slide 2: Đặt vấn đề & Thách thức Cloud**:
  * Chuyển dịch Localhost ➔ Cloud: Thách thức về Ephemeral Storage, SSL PostgreSQL, giới hạn RAM 512MB, cơ chế ngủ đông (Cold Start).
* **Slide 3: Giới thiệu Case Study (English AI Training)**:
  * Frontend (React 18), Backend (Spring Boot 3), AI Engine (FastAPI Whisper), DB (PostgreSQL 16), Media (Cloudinary).
* **Slide 4: Kiến trúc Hệ thống Phân lớp (System Architecture)**:
  * Chèn sơ đồ kiến trúc Microservices phân chia mạng Public và Private Network.
* **Slide 5: Hạ tầng dạng mã (IaC với render.yaml)**:
  * Triển khai đồng bộ cả cụm dịch vụ bằng 1 cú nhấp chuột (Blueprint Deploy).
* **Slide 6: Đường ống CI/CD Tự động hóa (GitHub Actions)**:
  * Sơ đồ pipeline 4 stage: Backend CI ➔ Frontend CI ➔ AI Engine CI ➔ Render Deploy Hook.
* **Slide 7: Các Bài học Xử lý Sự cố Nổi bật (Troubleshooting)**:
  * Xử lý URL JDBC SSL, khống chế Heap 350MB chống tràn RAM, tự phục hồi mã hóa UTF-8.
* **Slide 8: Giám sát Hệ thống & Giải pháp Chống Ngủ Đông**:
  * UptimeRobot 5 phút/lần + GitHub Actions Keep-Alive 10 phút/lần ➔ Đạt 100% Uptime.
* **Slide 9: Nghiệm thu & Hạch toán Chi phí**:
  * Bảng tổng hợp chi phí hạ tầng: **0 VNĐ / Tháng**.
* **Slide 10: Tổng kết & Cảm ơn**:
  * Tóm tắt đóng góp, link website live và sẵn sàng trả lời câu hỏi của Hội đồng.

---

### 3. KỊCH BẢN LIVE DEMO 3 PHÚT (DÀNH CHO NGƯỜI THUYẾT TRÌNH TRÊN LỚP)

* **Giây 0 – 30s (Chứng minh Web Live & Giám sát Uptime)**:
  * Mở trình duyệt ẩn danh vào: `https://english-frontend-1gwz.onrender.com`.
  * *Lời thoại*: *"Kính thưa thầy, toàn bộ hệ sinh thái của Nhóm 10 đã được phát hành thực tế ra Internet với chứng chỉ SSL/TLS. Hệ thống được giám sát liên tục bằng UptimeRobot với chỉ số sẵn sàng 100% Uptime, không hề bị trễ do ngủ đông."*
* **Giây 30 – 75s (Demo Tính năng Luyện nói Video YouTube & Chấm điểm AI)**:
  * Click vào bài học số 7: *"Talking about your childhood"*.
  * Bật chế độ **Shadowing**: Cho video chạy, dừng tại câu thoại phụ đề hiển thị đồng bộ.
  * Bấm nút **Micro** đọc một câu mẫu tiếng Anh ngắn ➔ AI Engine trả về điểm số phát âm và tô màu xanh/đỏ từng từ.
  * *Lời thoại*: *"Hệ thống kết hợp Microservice AI riêng biệt chạy Whisper và Levenshtein để soi lỗi phát âm từng từ của người học mà không làm quá tải Backend Java."*
* **Giây 75 – 120s (Demo Học Từ vựng & Quản lý Dữ liệu)**:
  * Chuyển sang menu **Từ vựng**: Mở các chủ đề *"Động Vật"* 🐾, *"Trái Cây"* 🍎, lật thẻ flashcard xem phiên âm IPA và nghĩa tiếng Việt chuẩn UTF-8.
  * Đăng nhập Google OAuth2 để đổi ảnh đại diện (avatar) lưu trữ tức thì lên Cloudinary CDN.
* **Giây 120 – 180s (Demo Minh chứng CI/CD & Blueprint Hạ tầng)**:
  * Mở nhanh tab **Render Dashboard**: Chỉ ra 4 dịch vụ (`english-frontend`, `english-backend`, `english-ai`, `english-db`) đang sáng đèn xanh (`Live`).
  * Mở tab **GitHub Actions**: Chỉ ra commit gần nhất chạy pipeline CI/CD tự động thành công.
  * *Lời thoại*: *"Toàn bộ hạ tầng này được thiết lập hoàn toàn tự động qua mã IaC và pipeline CI/CD, với chi phí vận hành tròn 0 VNĐ. Em xin kết thúc phần demo của Nhóm 10!"*
