# DÀN Ý CHI TIẾT BỘ SLIDE THUYẾT TRÌNH BẢO VỆ ĐỒ ÁN (14 SLIDES)
## HỌC PHẦN: ĐIỆN TOÁN ĐÁM MÂY (IS2023) — GVHD: TS. HOÀNG HỮU ĐỨC
**Đơn vị:** Khoa Kỹ thuật Máy tính và Điện tử — Trường Đại học CNTT & TT Việt - Hàn (VKU)  
**Nhóm thực hiện:** **Nhóm 10**  
**Đề tài:** *"A Step-by-Step Guide to Deploying Full-Stack Web and PostgreSQL to Render with CI/CD"*

---

> [!NOTE]
> Bộ slide được thiết kế chuẩn cấu trúc **14 trang** (12 trang báo cáo chính + 2 trang phân tích chuyên sâu và định hướng tương lai). Cấu trúc này giúp người thuyết trình phân bổ thời gian hợp lý (khoảng 8 – 10 phút thuyết trình + 3 phút live demo), trình bày đầy đủ từ kiến trúc, kỹ thuật xử lý lỗi đến bài toán chi phí và lộ trình mở rộng.

---

### SLIDE 1: TRANG TIÊU ĐỀ & THÔNG TIN CHUNG
* **Tiêu đề lớn**: A Step-by-Step Guide to Deploying Full-Stack Web and PostgreSQL to Render with CI/CD
* **Tiêu đề phụ**: Hướng dẫn Từng Bước Triển khai Hệ thống Web Full-Stack và CSDL PostgreSQL lên Nền tảng Đám mây Render với Đường ống CI/CD
* **Giảng viên hướng dẫn**: TS. Hoàng Hữu Đức
* **Nhóm sinh viên thực hiện**: **Nhóm 10** (Võ Thành Long - Lead CI/CD & Cloud DevOps, Huỳnh Đức Nhân, và các thành viên)
* **Thời gian**: Học kỳ 1, Năm học 2026 – 2027
* 🎙️ **Lời thoại gợi ý**: *"Kính thưa thầy Hoàng Hữu Đức và các bạn, hôm nay Nhóm 10 xin phép báo cáo đề tài Đồ án môn học Điện toán đám mây: Hướng dẫn triển khai Full-Stack Web và PostgreSQL lên Render với CI/CD, thông qua Case Study ứng dụng English AI Training..."*

---

### SLIDE 2: ĐẶT VẤN ĐỀ & THÁCH THỨC KHI ĐƯA ỨNG DỤNG LÊN CLOUD
* **Nội dung hiển thị**:
  * **Xu hướng**: Chuyển dịch từ máy chủ truyền thống (On-Premises) sang PaaS (Render) và DBaaS (Managed PostgreSQL) để tối ưu chi phí và tăng tốc độ phát triển.
  * **Rào cản từ Localhost lên Production Cloud**:
    1. *Hệ thống file phi trạng thái (Ephemeral File System)*: Container khởi động lại sẽ làm mất ảnh/file tạm.
    2. *Bảo mật kết nối cơ sở dữ liệu*: Chuỗi kết nối JDBC và giao thức SSL bắt buộc (`sslmode=require`).
    3. *Giới hạn phần cứng nghiêm ngặt*: Gói Free chỉ có 512MB RAM, dễ bị lỗi tràn bộ nhớ (OOMKilled) với Java Spring Boot.
    4. *Cơ chế ngủ đông (Cold Start)*: Ứng dụng bị dừng sau 15 phút không dùng, mất 50s để khởi động lại.
* 🎙️ **Lời thoại gợi ý**: *"Việc đưa một ứng dụng chạy tốt ở localhost lên môi trường đám mây thực tế luôn gặp phải những rào cản lớn về lưu trữ phi trạng thái, bảo mật chuỗi kết nối và tài nguyên giới hạn. Đó chính là lý do đề tài của chúng em ra đời."*

---

### SLIDE 3: CASE STUDY THỰC NGHIỆM — ENGLISH AI TRAINING APP
* **Nội dung hiển thị**:
  * **Bản chất**: Ứng dụng đóng vai trò Case Study tạo dữ liệu thực nghiệm, minh chứng log và lỗi thực tế cho bộ cẩm nang triển khai.
  * **Tech Stack**:
    * **Frontend Client**: React 18, Vite, TailwindCSS, đa ngôn ngữ i18n, Nginx Alpine.
    * **Backend Core**: Java Spring Boot 3, Java 17, Spring Data JPA, JWT, Google OAuth2.
    * **AI Engine**: Python FastAPI, Faster-Whisper (nhận diện giọng nói), Levenshtein Distance (soi lỗi phát âm).
    * **Cloud Database**: Managed PostgreSQL 16 (Render DBaaS).
    * **Cloud Storage**: Cloudinary Media CDN (lưu ảnh avatar).
* 🎙️ **Lời thoại gợi ý**: *"Để kiểm chứng bộ hướng dẫn, nhóm xây dựng Case Study là nền tảng English AI Training với đầy đủ tính năng: học từ vựng Flashcard, luyện nói tương tác qua video YouTube và chấm điểm phát âm bằng AI Whisper..."*

---

### SLIDE 4: KIẾN TRÚC HỆ THỐNG ĐÁM MÂY (CLOUD ARCHITECTURE)
* **Hình ảnh trung tâm**: Sơ đồ kiến trúc Microservices phân lớp (Mermaid diagram).
* **Nội dung hiển thị**:
  * **Public Facing Network (Mạng công cộng)**:
    * `english-frontend` (Nginx - Port 10000): Tiếp nhận lưu lượng người dùng qua HTTPS/Port 443.
    * `english-backend` (Spring Boot - Port 8080): Cung cấp RESTful API công cộng, xác thực JWT.
  * **Private Network (Mạng nội bộ bảo mật)**:
    * `english-ai` (FastAPI - Port 8000): Xử lý tính toán âm thanh, chỉ giao tiếp nội bộ với Backend.
    * `english-db` (PostgreSQL 16): Không mở port ra ngoài Internet, chỉ mở kết nối JDBC SSL cho Backend.
* 🎙️ **Lời thoại gợi ý**: *"Về mặt kiến trúc, hệ thống được phân tách nghiêm ngặt: người dùng chỉ tương tác với Frontend và Backend qua HTTPS, còn tầng CSDL và dịch vụ AI được giấu hoàn toàn trong mạng nội bộ để đảm bảo an ninh tuyệt đối."*

---

### SLIDE 5: GIẢI PHÁP LƯU TRỮ PHI TRẠNG THÁI (STATELESS STORAGE)
* **Nội dung hiển thị**:
  * **Vấn đề**: File upload cục bộ trên máy chủ đám mây (PaaS) bị mất sau mỗi lần redeploy.
  * **Giải pháp của Nhóm 10**: Tích hợp dịch vụ đám mây chuyên dụng **Cloudinary Media CDN**.
  * **Quy trình xử lý**:
    1. Người dùng upload ảnh đại diện tại giao diện React.
    2. Backend Spring Boot truyền trực tiếp luồng byte sang Cloudinary API.
    3. Cloudinary cấp phát URL HTTPS toàn cầu có cơ chế tối ưu hóa hình ảnh tự động.
    4. Backend chỉ lưu chuỗi URL đó vào bảng `users` trong PostgreSQL.
* 🎙️ **Lời thoại gợi ý**: *"Để giải quyết bài toán Ephemeral File System, nhóm đã chuyển toàn bộ việc lưu trữ tệp sang Cloudinary CDN, biến Backend thành kiến trúc hoàn toàn Stateless, sẵn sàng cho việc nhân rộng."*

---

### SLIDE 6: CONTAINER HÓA DOCKER MULTI-STAGE & TỐI ƯU HÓA RAM JVM
* **Nội dung hiển thị**:
  * **Docker Multi-stage Builds**:
    * *Backend*: Tách giai đoạn `builder` (Maven 3.9) và `runtime` (Temurin 17 JRE) ➔ Giảm kích thước ảnh từ **850MB** xuống **210MB**.
    * *Frontend*: Tách giai đoạn build Vite (Node 20) và runtime Nginx Alpine ➔ Giảm kích thước từ **600MB** xuống **25MB**.
  * **Tối ưu hóa bộ nhớ JVM trên Gói Free 512MB RAM**:
    * Cờ khởi chạy: `-Xms128m -Xmx350m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError`.
    * Khống chế trần Heap ở mức 350MB, dành 162MB cho Metaspace và hệ điều hành ➔ Triệt tiêu hoàn toàn lỗi **OOMKilled** của Linux Kernel.
* 🎙️ **Lời thoại gợi ý**: *"Một thách thức lớn của Spring Boot trên Cloud Free-tier là giới hạn 512MB RAM. Nhóm đã tối ưu hóa Docker đa tầng và khống chế cứng Heap máy ảo Java ở mức 350MB với bộ gom rác G1GC..."*

---

### SLIDE 7: HẠ TẦNG DẠNG MÃ (IaC) VỚI RENDER BLUEPRINT
* **Nội dung hiển thị**:
  * Toàn bộ hạ tầng đám mây được mã hóa trong một tệp duy nhất: `render.yaml`.
  * **Lợi ích của IaC**:
    * Khởi tạo đồng bộ cả 4 dịch vụ (Database, Backend, AI Engine, Frontend) chỉ bằng **1 cú click**.
    * Loại bỏ hoàn toàn sai sót cấu hình thủ công bằng tay (Human Errors).
    * Tự động liên kết các biến môi trường phụ thuộc chéo giữa các dịch vụ.
    * Quản lý bảo mật khóa bí mật thông qua thuộc tính `sync: false` (không lưu secret lên Git).
* 🎙️ **Lời thoại gợi ý**: *"Áp dụng triết lý DevOps hiện đại, nhóm định nghĩa toàn bộ hạ tầng bằng mã (Infrastructure as Code) qua tệp render.yaml. Bất kỳ ai cũng có thể tái tạo lại toàn bộ hệ thống này trong vòng 5 phút."*

---

### SLIDE 8: ĐƯỜNG ỐNG TỰ ĐỘNG HÓA CI/CD VỚI GITHUB ACTIONS
* **Nội dung hiển thị**:
  * Pipeline 4 stage hoàn chỉnh trong `.github/workflows/deploy.yml`:
    * **Stage 1 (Backend CI)**: JDK 17, phân quyền chmod `+x` cho `mvnw`, compile & test JAR.
    * **Stage 2 (Frontend CI)**: Node 20, kiểm tra lỗi cú pháp ESLint, build Vite tĩnh.
    * **Stage 3 (AI Engine CI)**: Python 3.11, kiểm tra cú pháp mã nguồn bằng `py_compile`.
    * **Stage 4 (Deploy Hook)**: Kích hoạt HTTP POST Webhook của Render để triển khai tự động.
  * **Cơ chế an toàn**: Giai đoạn 4 chỉ chạy khi cả 3 giai đoạn kiểm thử trên cùng đạt trạng thái `success`.
* 🎙️ **Lời thoại gợi ý**: *"Quy trình CI/CD của nhóm hoạt động hoàn toàn tự động. Khi lập trình viên push code mới, GitHub Actions sẽ kiểm tra chất lượng mã nguồn trên cả 3 dịch vụ rồi mới tự động gửi lệnh phát hành lên Render..."*

---

### SLIDE 9: CẨM NANG XỬ LÝ SỰ CỐ KỸ THUẬT THỰC TẾ (TROUBLESHOOTING)
* **Nội dung hiển thị** (Chọn 4 sự cố tiêu biểu nhất trong 7 sự cố):
  1. *Lỗi URL JDBC*: Render cấp `postgres://`, Spring Boot cần `jdbc:postgresql://` ➔ Viết [`DataSourceConfig.java`](file:///d:/VKU_SEMESTER_7/dien_toan_dam_may/final/english_training_app/backend-core/backend-core/src/main/java/com/example/backend_core/config/DataSourceConfig.java) chuyển đổi động.
  2. *Nginx Crash do DNS Upstream*: Chuyển sang mô hình Static Assets SPA và cấu hình Dynamic URL Fallback.
  3. *Lỗi lệch thứ tự cột Hibernate DDL*: Mất dữ liệu câu thoại ➔ Chuẩn hóa câu lệnh SQL với danh sách cột tường minh 100%.
  4. *Lỗi Tiếng Việt UTF-8 thành `?`*: Nâng cấp cơ chế tự sửa lỗi dữ liệu (Self-healing) trong `DatabaseSeeder.java`.
* 🎙️ **Lời thoại gợi ý**: *"Điểm giá trị nhất của đồ án là kinh nghiệm thực chiến. Nhóm đã ghi nhận và giải quyết triệt để 7 lỗi kỹ thuật phức tạp từ tầng ứng dụng, cơ sở dữ liệu đến mạng và bộ nhớ..."*

---

### SLIDE 10: VẬN HÀNH, GIÁM SÁT UPTIME & GIẢI PHÁP CHỐNG NGỦ ĐÔNG
* **Nội dung hiển thị**:
  * **Vấn đề**: Render Free-tier tự động ngủ đông (Spin-down) sau 15 phút, gây trễ khởi động lạnh 50 giây.
  * **Giải pháp Giám sát Kép (Dual Anti-Sleep)**:
    * *Lớp 1*: **UptimeRobot** gửi HTTP(s) ping đều đặn mỗi **5 phút/lần** vào endpoint `/api/vocabularies`.
    * *Lớp 2*: **GitHub Actions Cron Workflow** (`keep_alive.yml`) dự phòng mỗi **10 phút/lần**.
  * **Kết quả thực nghiệm**: Hệ thống duy trì chỉ số sẵn sàng **100% Uptime** liên tục, thời gian phản hồi tức thì dưới 100ms.
* 🎙️ **Lời thoại gợi ý**: *"Để khắc phục triệt để hạn chế ngủ đông của gói Free, nhóm áp dụng giải pháp giám sát kép: UptimeRobot ping 5 phút một lần kết hợp GitHub Actions Cron, giữ cho server luôn luôn thức và đạt 100% Uptime."*

---

### SLIDE 11: NGHIỆM THU HỆ THỐNG & BẢNG HẠCH TOÁN CHI PHÍ
* **Nội dung hiển thị**:
  * **Bảng kiểm nghiệm tính năng**: Đăng nhập Google, Luyện Shadowing YouTube, AI chấm điểm, Từ vựng Flashcard, CI/CD tự động ➔ Đạt 100%.
  * **Bảng hạch toán chi phí hàng tháng**:
    * Render Managed Database: **0 VNĐ**
    * Render Web Services (3 dịch vụ): **0 VNĐ**
    * Cloudinary Media CDN: **0 VNĐ**
    * GitHub Actions Runner: **0 VNĐ**
    * UptimeRobot Monitoring: **0 VNĐ**
    * 👉 **TỔNG CHI PHÍ VẬN HÀNH**: **0 VNĐ / Tháng**
* 🎙️ **Lời thoại gợi ý**: *"Toàn bộ hệ thống Microservices đa tầng kết hợp AI này đang vận hành thực tế 24/7 trên đám mây với chi phí tròn 0 đồng, chứng minh tính tối ưu hóa tài nguyên vượt trội của giải pháp."*

---

### SLIDE 12: ĐÁNH GIÁ ƯU / NHƯỢC ĐIỂM CỦA MÔ HÌNH CLOUD PAAS & DBAAS
* **Nội dung hiển thị**:
  * **Ưu điểm vượt trội**:
    * Triển khai nhanh chóng (Zero Infrastructure Management), tự động hóa cấp phát chứng chỉ SSL/TLS miễn phí.
    * Hệ sinh thái tích hợp hoàn hảo với Git (GitOps Workflow).
    * Khả năng quản lý hạ tầng dạng mã (IaC) chuẩn hóa.
  * **Hạn chế & Rủi ro thực tế**:
    * Giới hạn tài nguyên ở gói miễn phí (512MB RAM, CPU chia sẻ).
    * Độ trễ phân giải DNS nội bộ giữa các Web Service.
    * Cần kỹ năng tối ưu hóa sâu ở tầng ứng dụng (Memory Tuning & Keep-Alive).
* 🎙️ **Lời thoại gợi ý**: *"Qua quá trình thực nghiệm, nhóm nhận thấy mô hình PaaS/DBaaS mang lại tốc độ phát triển cực cao cho các dự án khởi nghiệp và vừa nhỏ, nhưng đòi hỏi kỹ sư phải nắm rất vững kỹ thuật tối ưu tài nguyên."*

---

### SLIDE 13: ĐỊNH HƯỚNG PHÁT TRIỂN TRONG TƯƠNG LAI (FUTURE ROADMAP)
* **Nội dung hiển thị**:
  1. **Nâng cấp Hạ tầng & Tự động Mở rộng (Auto-scaling)**:
     * Chuyển dịch lên cụm Kubernetes (K8s) hoặc Render Pro Plan với cơ chế tự động mở rộng theo lưu lượng CPU/RAM (Horizontal Pod Autoscaling).
  2. **Bộ nhớ đệm Phân tán (Distributed Caching)**:
     * Tích hợp Redis Cloud Cache để lưu trữ kết quả phân tích AI và phụ đề bài học, giảm tải tối đa cho CSDL PostgreSQL.
  3. **Tên miền Riêng & Mạng phân phối CDN toàn cầu**:
     * Trỏ Custom Domain và tích hợp Cloudflare Proxy (DDoS Protection, Edge Caching, Web Application Firewall).
  4. **Nâng cấp Trí tuệ Nhân tạo Đa phương thức (Multimodal AI)**:
     * Đưa mô hình AI Whisper lên cụm GPU riêng biệt, nâng cấp thuật toán chấm điểm ngữ điệu (Intonation & Pitch Analysis).
* 🎙️ **Lời thoại gợi ý**: *"Trong tương lai, khi quy mô học viên mở rộng, nhóm định hướng bổ sung tầng Redis Caching, chuyển đổi sang cụm Kubernetes và tích hợp Cloudflare WAF để tối ưu hóa bảo mật và hiệu năng toàn diện."*

---

### SLIDE 14: TỔNG KẾT, LINK TRẢI NGHIỆM & HỎI ĐÁP (Q&A)
* **Nội dung hiển thị**:
  * **Website trực tuyến**: `https://english-frontend-1gwz.onrender.com`
  * **GitHub Repository**: `github.com/vothanhlong16072005-creator/english-training-app_cloud`
  * **Thông điệp kết luận**: Đồ án đã hoàn thành 100% mục tiêu, cung cấp cẩm nang triển khai đám mây thực tế và hệ thống ứng dụng chạy thật ổn định.
  * **Lời cảm ơn**: Cảm ơn thầy TS. Hoàng Hữu Đức đã tận tình hướng dẫn!
  * **Phần giải đáp thắc mắc (Q&A)**.
* 🎙️ **Lời thoại gợi ý**: *"Nhóm 10 xin chân thành cảm ơn thầy đã chú ý lắng nghe! Sau đây, chúng em xin kính mời thầy theo dõi phần Live Demo 3 phút thực tế của ứng dụng..."*
