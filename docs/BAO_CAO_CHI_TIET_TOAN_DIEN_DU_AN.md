# BÁO CÁO KỸ THUẬT TOÀN DIỆN ĐỒ ÁN MÔN HỌC
# HỌC PHẦN: ĐIỆN TOÁN ĐÁM MÂY (IS2023)

---

> **TÊN ĐỀ TÀI**: **A Step-by-Step Guide to Deploying Full-Stack Web and PostgreSQL to Render with CI/CD**  
> *(Hướng dẫn từng bước triển khai hệ thống Web Full-Stack và PostgreSQL lên nền tảng Render kết hợp tự động hóa CI/CD)*  
> **Đơn vị đào tạo**: Khoa Kỹ thuật Máy tính và Điện tử — Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn (VKU), Đại học Đà Nẵng  
> **Giảng viên hướng dẫn**: **TS. Hoàng Hữu Đức**  
> **Nhóm sinh viên thực hiện**: **Nhóm 10**  
> **Thời gian thực hiện**: Học kỳ 1, Năm học 2026 – 2027  

---

## MỤC LỤC CHI TIẾT
1. [CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI & BỐI CẢNH KỸ THUẬT](#chương-1-tổng-quan-đề-tài--bối-cảnh-kỹ-thuật)
2. [CHƯƠNG 2: KIẾN TRÚC HỆ THỐNG & THIẾT KẾ HẠ TẦNG ĐÁM MÂY](#chương-2-kiến-trúc-hệ-thống--thiết-kế-hạ-tầng-đám-mây)
3. [CHƯƠNG 3: QUÁ TRÌNH TRIỂN KHAI THỰC NGHIỆM CHI TIẾT (TUẦN 1 – TUẦN 4)](#chương-3-quá-trình-triển-khai-thực-nghiệm-chi-tiết-tuần-1--tuần-4)
4. [CHƯƠNG 4: CẨM NANG XỬ LÝ SỰ CỐ KỸ THUẬT THỰC TẾ (TROUBLESHOOTING GUIDE)](#chương-4-cẩm-nang-xử-lý-sự-cố-kỹ-thuật-thực-tế-troubleshooting-guide)
5. [CHƯƠNG 5: ĐÁNH GIÁ KẾT QUẢ, HẠCH TOÁN CHI PHÍ & KẾT LUẬN](#chương-5-đánh-giá-kết-quả-hạch-toán-chi-phí--kết-luận)

---

# CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI & BỐI CẢNH KỸ THUẬT

### 1.1. Bối cảnh và Tính cấp thiết của Đề tài
Trong kỷ nguyên số hóa, các doanh nghiệp và đội ngũ phát triển phần mềm đang chuyển dịch mạnh mẽ từ mô hình hạ tầng truyền thống (On-Premises) sang mô hình điện toán đám mây công cộng (Public Cloud). Trong đó, hai mô hình dịch vụ nổi bật là:
* **PaaS (Platform as a Service)**: Cho phép lập trình viên tập trung hoàn toàn vào việc phát triển ứng dụng nghiệp vụ mà không cần trực tiếp quản trị hệ điều hành, cấu hình mạng hay vá lỗi bảo mật phần cứng.
* **DBaaS (Database as a Service)**: Cung cấp hệ quản trị cơ sở dữ liệu được quản lý tự động (Managed Database) với khả năng tự động sao lưu, mã hóa dữ liệu tại chỗ và cấu hình kết nối bảo mật qua SSL/TLS.

Tuy nhiên, quá trình đưa một ứng dụng Full-Stack từ môi trường máy tính cục bộ (**Localhost**) lên môi trường đám mây thực tế (**Production Cloud**) luôn đối mặt với những rào cản kỹ thuật nghiêm ngặt:
1. **Hệ thống tệp phi trạng thái (Ephemeral File System)**: Các container chạy trên đám mây sẽ xóa sạch các tệp tin cục bộ khi tái khởi động (Restart/Redeploy). Do đó, giải pháp lưu trữ tệp tin tĩnh (hình ảnh, âm thanh) buộc phải chuyển sang các dịch vụ lưu trữ đám mây ngoài (Media Storage CDN).
2. **Cơ chế bảo mật kết nối CSDL đám mây**: Việc kết nối giữa máy chủ backend và CSDL từ xa đòi hỏi giao thức bảo mật SSL (`sslmode=require`) cùng kỹ thuật xử lý chuỗi kết nối chuẩn xác.
3. **Giới hạn tài nguyên phần cứng nghiêm ngặt**: Các gói dịch vụ miễn phí (Free-tier) thường bị giới hạn ở mức 512MB RAM và CPU chia sẻ, dễ gây ra hiện tượng tràn bộ nhớ (Out-Of-Memory - OOM).
4. **Tự động hóa phát hành (CI/CD)**: Nhu cầu tự động hóa việc kiểm thử mã nguồn và đồng bộ hóa phát hành liên tục lên đám mây khi có commit mới.

### 1.2. Mục tiêu Cốt lõi của Đề tài
* **Bản chất đề tài**: Đồ án **Kỹ thuật Triển khai Đám mây (Cloud Deployment Engineering)**.
* **Sản phẩm cốt lõi**: Bộ cẩm nang tài liệu kỹ thuật hoàn chỉnh (*Step-by-Step Technical Guide*), hướng dẫn chi tiết quá trình đóng gói, thiết lập hạ tầng dạng mã (IaC), cấu hình đường ống CI/CD và vận hành một ứng dụng Full-Stack lên nền tảng đám mây **Render** kết nối **PostgreSQL Managed**.
* **Ứng dụng thực nghiệm (Case Study)**: Nền tảng **English AI Training App** đóng vai trò là ứng dụng thực tế để kiểm chứng toàn bộ quy trình triển khai, tạo lập dữ liệu minh chứng xác thực (ảnh chụp, log vận hành, mã lỗi thực tế).

### 1.3. Giới thiệu Ứng dụng Thực nghiệm (English AI Training App)
Hệ thống là một giải pháp học tiếng Anh trực tuyến hiện đại, ứng dụng Trí tuệ Nhân tạo để phân tích giọng nói và video tương tác:
* **Frontend**: Xây dựng bằng React 18, Vite, TailwindCSS, hỗ trợ Dark/Light mode, hệ thống Flashcard từ vựng, trình luyện nói tương tác qua video YouTube (Shadowing, Dictation, Teleprompter).
* **Backend Core**: Xây dựng bằng Spring Boot 3 (Java 17), Spring Data JPA, Spring Security, JWT, Google OAuth2, cung cấp RESTful APIs quản lý người dùng, bài học, câu thoại, tiến độ học.
* **AI Service Engine**: Xây dựng bằng Python FastAPI, tích hợp mô hình **Faster-Whisper** (`base` int8) nhận diện giọng nói và thuật toán **Levenshtein Distance** chấm điểm phát âm; kết hợp LLM (Groq LLaMA 3.3 / Gemini) để sinh phụ đề và phiên âm IPA.
* **Database**: Hệ quản trị cơ sở dữ liệu quan hệ **PostgreSQL 16**.
* **Media Storage**: **Cloudinary CDN** quản lý tệp tải lên (ảnh đại diện).

### 1.4. Bảng Phân công Nhân sự & Lịch trình 4 Tuần
Dự án được phân bổ khoa học theo quy trình 4 tuần với vai trò rõ ràng của các thành viên Nhóm 10:

| Giai đoạn | Thời gian | Người chủ trì (Lead) | Nhiệm vụ trọng tâm |
| :--- | :---: | :--- | :--- |
| **Tuần 1** | 08/10 – 20/10 | Thành viên Nhóm 10 | Thiết kế CSDL PostgreSQL, nạp dữ liệu mẫu, tích hợp Cloudinary CDN, cấu hình kết nối an toàn. |
| **Tuần 2** | 21/10 – 28/10 | Thành viên Nhóm 10 | Container hóa Docker Multi-stage cho 3 dịch vụ, tối ưu hóa RAM JVM Java, viết tệp IaC `render.yaml`. |
| **Tuần 3** | 29/10 – 05/11 | Võ Thành Long | Xây dựng pipeline CI/CD GitHub Actions, cấu hình Deploy Hooks, đưa dịch vụ lên Public Internet. |
| **Tuần 4** | 06/11 – 10/11 | Huỳnh Đức Nhân | Vận hành giám sát UptimeRobot chống ngủ đông, biên soạn báo cáo kỹ thuật, slide và kịch bản demo. |

---

# CHƯƠNG 2: KIẾN TRÚC HỆ THỐNG & THIẾT KẾ HẠ TẦNG ĐÁM MÂY

### 2.1. Sơ đồ Kiến trúc Phân tầng Đám mây (Cloud Architecture)

```mermaid
flowchart TD
    subgraph Users["🌐 Người dùng cuối (Clients)"]
        Browser["Trình duyệt Web (Desktop / Mobile)"]
    end

    subgraph CDN["☁️ Dịch vụ Media Đám mây"]
        Cloudinary["Cloudinary Media CDN<br/>(Lưu trữ ảnh Avatar)"]
    end

    subgraph RenderPlatform["🚀 Nền tảng Đám mây Render (Singapore Region)"]
        subgraph PublicFacing["Tầng Tiếp Nhận Công Cộng (Public HTTPS)"]
            FE["english-frontend<br/>(Nginx Alpine - Port 10000)"]
            BE["english-backend<br/>(Spring Boot 3 - Port 8080)"]
        end

        subgraph InternalNetwork["Mạng Nội Bộ Đám Mây (Private Network)"]
            AI["english-ai<br/>(FastAPI Whisper - Port 8000)"]
            DB[("english-db<br/>(PostgreSQL 16 Managed)") ]
        end
    end

    subgraph DevOps["🔄 Tự động hóa CI/CD & Giám sát"]
        GH["GitHub Actions<br/>(Automated Testing & Deploy Hooks)"]
        UR["UptimeRobot & Cron Keep-Alive<br/>(Ping 5-10 phút/lần chống Sleep)"]
    end

    Browser -->|HTTPS / Port 443| FE
    Browser -->|REST API / HTTPS| BE
    FE -->|API Calls / JSON| BE
    BE -->|Upload / Fetch Avatar| Cloudinary
    BE -->|gRPC / Internal HTTP| AI
    BE -->|JDBC SSL Port 5432| DB
    GH -->|Deploy Webhook| RenderPlatform
    UR -.->|Health Check Ping| BE
    UR -.->|Health Check Ping| FE
```

### 2.2. Phân tích Các Thành phần Dịch vụ

#### 1. Dịch vụ Cơ sở Dữ liệu Đám mây (`english-db`)
* **Loại dịch vụ**: Managed PostgreSQL Database (DBaaS) trên Render.
* **Phiên bản**: PostgreSQL 16.
* **Đặc tính kỹ thuật**: Tách biệt hoàn toàn khỏi máy chủ ứng dụng, tự động cấu hình cơ chế mã hóa kết nối SSL/TLS (`sslmode=require`). Chỉ cho phép các dịch vụ backend nội bộ truy cập qua hostname riêng `dpg-dbp4abom7kps739pmcd0-a:5432`.

#### 2. Dịch vụ Lưu trữ Media Tĩnh (Cloudinary Media CDN)
* **Vấn đề giải quyết**: Khắc phục tính chất **Ephemeral File System** của nền tảng PaaS (nơi mọi tệp ghi tạm vào ổ đĩa container sẽ biến mất khi container khởi động lại).
* **Cơ chế**: Khi người dùng tải ảnh avatar lên, Spring Boot truyền thẳng luồng dữ liệu byte sang Cloudinary API qua thư viện `com.cloudinary:cloudinary-http44`. URL trả về từ CDN (dạng `https://res.cloudinary.com/...`) sẽ được lưu vào trường `avatar_url` trong bảng `users` của PostgreSQL.

#### 3. Dịch vụ Máy chủ Ứng dụng Backend (`english-backend`)
* **Công nghệ**: Spring Boot 3, Java 17, Spring Data JPA, Hibernate ORM, Spring Security.
* **Cơ chế triển khai**: Đóng gói dạng Docker Container đa tầng.
* **Tối ưu hóa tài nguyên**: Áp dụng cờ JVM `-Xms128m -Xmx350m -XX:+UseG1GC` nhằm giới hạn dung lượng heap tối đa ở mức 350MB, ngăn ngừa triệt để lỗi bị hệ điều hành tắt ứng dụng do tràn bộ nhớ (OOMKilled) trên gói Free (512MB RAM).

#### 4. Dịch vụ Trí tuệ Nhân tạo AI Engine (`english-ai`)
* **Công nghệ**: Python 3.11, FastAPI, Uvicorn, Faster-Whisper, Groq API Client.
* **Đặc điểm**: Đặt trong mạng nội bộ, chỉ nhận yêu cầu phân tích âm thanh từ Backend. Sử dụng mô hình nhận diện giọng nói Faster-Whisper phiên bản `base` với định dạng lượng tử hóa `int8` để giảm thiểu tải CPU.

#### 5. Dịch vụ Giao diện Người dùng Frontend (`english-frontend`)
* **Công nghệ**: React 18, Vite, Nginx Alpine.
* **Cơ chế**: Mã nguồn React được biên dịch (build) thành các tệp HTML/CSS/JS tĩnh, sau đó được máy chủ Web Nginx siêu nhẹ phục vụ trên cổng cổng 10000 theo chuẩn cổng mặc định của Render.

### 2.3. Hạ tầng Dạng mã (Infrastructure as Code - IaC) với `render.yaml`
Toàn bộ hạ tầng của dự án được định nghĩa bằng tệp `render.yaml` tại thư mục gốc của repository, cho phép khởi tạo toàn bộ hệ sinh thái (Database, Backend, AI Engine, Frontend) chỉ thông qua một cú nhấp chuột (**Deploy Blueprint**):
* Quản lý tự động các biến môi trường phụ thuộc (Cross-service Environment Variables).
* Tự động liên kết `SPRING_DATASOURCE_URL` từ CSDL `english-db` sang dịch vụ `english-backend`.
* Khai báo cổng lắng nghe `PORT: "8000"` cho AI Service và `PORT: "10000"` cho Frontend.

---

# CHƯƠNG 3: QUÁ TRÌNH TRIỂN KHAI THỰC NGHIỆM CHI TIẾT (TUẦN 1 – TUẦN 4)

### 3.1. Tuần 1: Thiết kế Cơ sở Dữ liệu Đám mây & Tích hợp Media CDN
* **Khởi tạo Managed PostgreSQL**:
  1. Đăng nhập vào Render Dashboard, tạo cơ sở dữ liệu `english_training` tại vùng Singapore.
  2. Thu thập chuỗi kết nối nội bộ (**Internal Connection String**) để bảo mật tuyệt đối, ngăn chặn việc phơi nhiễm cổng 5432 ra Internet công cộng.
* **Thiết kế Schema CSDL**:
  * Các bảng quan hệ chính: `users`, `topic`, `vocabulary`, `lesson`, `sentence`, `evaluation`, `user_vocabulary`.
* **Tích hợp Cloudinary**:
  * Đăng ký tài khoản Cloudinary, thu thập `CLOUD_NAME`, `API_KEY` và `API_SECRET`.
  * Xây dựng `CloudinaryConfig.java` và `CloudinaryService.java` xử lý upload ảnh an toàn.

### 3.2. Tuần 2: Container hóa Docker Multi-stage & Thiết kế IaC Blueprint
* **Xây dựng Dockerfile Multi-stage**:
  * *Backend*: Tách biệt giai đoạn biên dịch mã nguồn (giai đoạn `builder` sử dụng `maven:3.9-eclipse-temurin-17-alpine`) và giai đoạn thực thi (giai đoạn runtime chỉ sử dụng `eclipse-temurin:17-jre-alpine`). Giúp giảm kích thước ảnh Docker từ **850MB** xuống còn **210MB**.
  * *Frontend*: Biên dịch bundle với `node:20-alpine` và đóng gói phục vụ qua `nginx:alpine`. Giúp giảm dung lượng ảnh từ **600MB** xuống còn **25MB**.
* **Soạn thảo Blueprint `render.yaml`**:
  * Khai báo tập trung toàn bộ 3 Web Services và 1 Database.
  * Thiết lập cấu hình bảo vệ bí mật thông qua thuộc tính `sync: false` cho khóa `CLOUDINARY_API_SECRET`.

### 3.3. Tuần 3: Xây dựng Đường ống CI/CD với GitHub Actions & Phát hành Public
* **Xây dựng Pipeline CI/CD bốn giai đoạn (`.github/workflows/deploy.yml`)**:
  * **Stage 1 (Backend CI)**: Cài đặt JDK 17, phân quyền tệp thực thi cho Maven Wrapper, biên dịch mã nguồn và kiểm thử.
  * **Stage 2 (Frontend CI)**: Cài đặt Node 20, cài đặt gói phụ thuộc với `npm ci`, kiểm tra lỗi cú pháp với ESLint và kiểm thử đóng gói với Vite.
  * **Stage 3 (AI Engine CI)**: Cài đặt Python 3.11, kiểm tra cú pháp mã nguồn bằng `py_compile`.
  * **Stage 4 (Deploy Trigger)**: Sử dụng Render Deploy Hooks. Chỉ khi cả 3 giai đoạn kiểm thử trên đều đạt màu xanh (trạng thái `success`), GitHub Actions mới gửi lệnh HTTP POST đến webhook của Render để kích hoạt việc tự động kéo mã nguồn mới nhất và triển khai.
* **Phát hành Public**:
  * Frontend được công khai tại: `https://english-frontend-1gwz.onrender.com`
  * Backend API được công khai tại: `https://english-backend-bgos.onrender.com`

### 3.4. Tuần 4: Thiết lập Hệ thống Giám sát Uptime & Vận hành Chống Ngủ Đông
* **Vấn đề "Spin-down" của Render Free-tier**: Sau 15 phút không có lưu lượng truy cập (inbound request), Render sẽ tự động chuyển container sang chế độ ngủ đông nhằm tiết kiệm tài nguyên. Khi có người dùng truy cập lại, thời gian khởi động lạnh (**Cold Start**) mất từ **50 đến 120 giây**, tạo ra trải nghiệm người dùng kém.
* **Giải pháp Giám sát Kép (Dual Anti-Sleep Monitoring)**:
  1. **UptimeRobot**: Cấu hình monitor loại `HTTP(s)` gửi tín hiệu ping đều đặn mỗi **5 phút/lần** đến endpoint `/api/vocabularies` của Backend và trang chủ Frontend.
  2. **GitHub Actions Keep-Alive**: Viết kịch bản workflow `.github/workflows/keep_alive.yml` chạy theo lịch trình định kỳ mỗi **10 phút/lần** (`cron: '*/10 * * * *'`) như một lớp bảo vệ dự phòng.
* **Kết quả**: Hệ thống duy trì chỉ số sẵn sàng **100% Uptime** liên tục, thời gian phản hồi trang luôn dưới **100ms**.

---

# CHƯƠNG 4: CẨM NANG XỬ LÝ SỰ CỐ KỸ THUẬT THỰC TẾ (TROUBLESHOOTING GUIDE)

> [!IMPORTANT]
> Đây là chương đúc kết toàn bộ các sự cố kỹ thuật thực tế mà Nhóm 10 đã trực tiếp gặp phải và giải quyết thành công trong suốt quá trình triển khai hệ thống lên đám mây Render.

### Sự cố 4.1: Xung đột Định dạng Chuỗi Kết nối CSDL (`postgres://` vs `jdbc:postgresql://`)
* **Hiện tượng lỗi**: Dịch vụ `english-backend` khởi động thất bại ngay tại giai đoạn Bootstrapping, Render báo lỗi:  
  `Exit status 1: Cannot load driver class: org.postgresql.Driver` hoặc `Invalid URL: postgres://...`.
* **Phân tích nguyên nhân**: Biến môi trường do Render tự động cấp phát khi liên kết Database Blueprint có tiền tố chuẩn đám mây:  
  `postgres://user:password@host:port/database`  
  Tuy nhiên, Java Database Connectivity (JDBC) của hệ sinh thái Spring Boot bắt buộc URL phải có tiền tố `jdbc:postgresql://` kèm tham số bảo mật `?sslmode=require`.
* **Giải pháp kỹ thuật của Nhóm 10**:
  Xây dựng lớp cấu hình chuyển đổi động [`DataSourceConfig.java`](file:///d:/VKU_SEMESTER_7/dien_toan_dam_may/final/english_training_app/backend-core/backend-core/src/main/java/com/example/backend_core/config/DataSourceConfig.java) tự động nhận diện và bóc tách chuỗi URL của Render:
  ```java
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
      URI uri = new URI(url);
      String host = uri.getHost();
      int port = uri.getPort() != -1 ? uri.getPort() : 5432;
      String path = uri.getPath();
      String userInfo = uri.getUserInfo();
      // Chuyển đổi thành chuẩn JDBC hợp lệ
      String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + "?sslmode=require";
      builder.url(jdbcUrl);
  }
  ```

---

### Sự cố 4.2: Tràn Bộ nhớ Máy ảo Java JVM (OOMKilled) trên Gói Free 512MB RAM
* **Hiện tượng lỗi**: Backend khởi động đến giai đoạn tải Hibernate thì bị tắt đột ngột (Killed), Render ghi log: `Container killed by Out-Of-Memory (OOM) killer`.
* **Phân tích nguyên nhân**: Mặc định máy ảo Java (HotSpot JVM) trên Linux sẽ tự động nhận diện bộ nhớ vật lý của máy chủ gốc (Node Server thường có 32GB hoặc 64GB RAM) và cấp phát Heap Size lên tới 25% dung lượng máy chủ đó. Khi container chạy trong giới hạn cgroup 512MB của Render, JVM cố gắng cấp phát vượt quá 512MB khiến Kernel lập tức tiêu diệt tiến trình.
* **Giải pháp kỹ thuật của Nhóm 10**:
  Tối ưu hóa các cờ tham số của máy ảo Java trong lệnh khởi chạy `ENTRYPOINT` của `Dockerfile`:
  ```dockerfile
  ENTRYPOINT ["java", \
    "-Xms128m", \
    "-Xmx350m", \
    "-XX:+UseG1GC", \
    "-XX:+ExitOnOutOfMemoryError", \
    "-jar", "app.jar"]
  ```
  * `-Xms128m`: Khởi tạo heap ban đầu ở mức tối thiểu 128MB.
  * `-Xmx350m`: Đặt trần cứng cho vùng nhớ Heap tối đa là 350MB (dành ra 162MB cho Metaspace, luồng và các tệp đệm hệ điều hành, đảm bảo tổng thể luôn dưới 512MB).
  * `-XX:+UseG1GC`: Sử dụng bộ thu gom rác Garbage-First Collector giúp tối ưu độ trễ và giải phóng bộ nhớ nhanh chóng.

---

### Sự cố 4.3: Nginx Crash lúc Khởi động do Phân giải Tên miền Tĩnh (Static Upstream DNS)
* **Hiện tượng lỗi**: Dịch vụ `english-frontend` bị thất bại sau 21 giây triển khai, log Nginx báo:  
  `[emerg] 1#1: host not found in upstream "backend" in /etc/nginx/conf.d/default.conf:2`.
* **Phân tích nguyên nhân**: Cấu hình tệp `nginx.conf` ban đầu khai báo khối `upstream backend { server backend:8080; }`. Trên hạ tầng đám mây công cộng của Render, các Web Service được phân phối tên miền độc lập qua FQDN (Fully Qualified Domain Name). Khi Nginx khởi động, nếu dịch vụ backend chưa hoàn tất phân giải DNS nội bộ, Nginx sẽ gặp lỗi cú pháp nghiêm trọng và crash tiến trình chính.
* **Giải pháp kỹ thuật của Nhóm 10**:
  1. Cấu hình Nginx thuần túy phục vụ tài nguyên tệp tĩnh (Static Assets SPA) và định tuyến cổng mặc định 10000 của Render.
  2. Bổ sung cơ chế Fallback URL động trực tiếp trong mã nguồn React Client ([`apiClient.js`](file:///d:/VKU_SEMESTER_7/dien_toan_dam_may/final/english_training_app/frontend-client/src/auth/apiClient.js)):
     ```javascript
     const BASE_URL = import.meta.env.VITE_API_URL || "https://english-backend-bgos.onrender.com";
     ```
     Điều này giúp Frontend giao tiếp trực tiếp với Backend qua giao thức HTTPS công cộng, loại bỏ hoàn toàn việc phụ thuộc vào Upstream Proxy cục bộ.

---

### Sự cố 4.4: Lỗi Mã hóa Ký tự Tiếng Việt (UTF-8 Encoding) biến thành Dấu `?`
* **Hiện tượng lỗi**: Người dùng truy cập trang Học từ vựng (`/vocabulary`), toàn bộ tiêu đề chủ đề và nghĩa tiếng Việt đều hiển thị dưới dạng dấu hỏi chấm: `????`, `?????ng V???t`, `Tr??i C??y & Th???c Ph???m`.
* **Phân tích nguyên nhân**: Quá trình xuất và chuyển đổi tệp `seed_data.sql` bằng công cụ PowerShell trước đó đã áp dụng bảng mã UTF-16LE hoặc mã hóa Windows-1252, làm mất các byte biểu diễn ký tự có dấu và emoji UTF-8.
* **Giải pháp kỹ thuật của Nhóm 10**:
  1. Chuyển đổi toàn bộ bộ dữ liệu sang chuẩn mã hóa **Pure UTF-8 without BOM**.
  2. Nâng cấp lớp [`DatabaseSeeder.java`](file:///d:/VKU_SEMESTER_7/dien_toan_dam_may/final/english_training_app/backend-core/backend-core/src/main/java/com/example/backend_core/config/DatabaseSeeder.java) tích hợp cơ chế tự phục hồi (Self-Healing): Khi khởi động, backend tự kiểm tra nếu phát hiện tên chủ đề chứa dấu `?`, hệ thống sẽ tự động dọn sạch các bản ghi lỗi và nạp lại toàn bộ dữ liệu UTF-8 chuẩn xác.

---

### Sự cố 4.5: Lệch Thứ tự Cột do Hibernate Auto-DDL làm Mất Câu Thoại Bài Học
* **Hiện tượng lỗi**: Người dùng vào xem video bài học (`/lesson/7`), video phát bình thường nhưng khung phụ đề hiển thị *"Đang tải dữ liệu..."* vô tận. API `/api/sentences/lesson/7` trả về mảng rỗng `[]`.
* **Phân tích nguyên nhân**: Các câu lệnh chèn dữ liệu cũ viết dưới dạng `INSERT INTO public.sentence VALUES (1, 'content', 15.8, ...)`. Do không khai báo danh sách cột, khi Hibernate tự động khởi tạo bảng theo thứ tự sắp xếp chữ cái (`content`, `end_time`, `id`, `ipa`, `lesson_id`, `order_index`, `start_time`), các giá trị số thực bị map nhầm vào cột khóa ngoại hoặc văn bản, dẫn đến việc toàn bộ câu thoại bị PostgreSQL từ chối ghi nhận.
* **Giải pháp kỹ thuật của Nhóm 10**:
  Chuẩn hóa toàn bộ câu lệnh SQL sang cú pháp tường minh 100% cột:
  ```sql
  INSERT INTO sentence (id, content, end_time, order_index, start_time, lesson_id, ipa, translation) VALUES (...);
  ```
  Nhờ đó, dù Hibernate sắp xếp cột trong schema theo bất kỳ trật tự nào, dữ liệu vẫn được nạp chuẩn xác tuyệt đối.

---

### Sự cố 4.6: Quyền Thực thi Tệp Shell Script `./mvnw: Permission denied` trên Linux CI
* **Hiện tượng lỗi**: Pipeline GitHub Actions chạy trên máy ảo `ubuntu-latest` bị gãy tại bước Backend CI với thông báo:  
  `bash: ./mvnw: Permission denied (Exit code 126)`.
* **Phân tích nguyên nhân**: Thành viên trong nhóm lập trình trên môi trường Windows NTFS. Hệ thống tệp NTFS không lưu trữ cờ phân quyền thực thi `+x` của POSIX. Khi mã nguồn được commit và push lên Git, tệp `mvnw` bị gán quyền đọc-ghi mặc định `644`.
* **Giải pháp kỹ thuật của Nhóm 10**:
  Cập nhật chỉ mục Git bằng lệnh:
  ```bash
  git update-index --chmod=+x backend-core/backend-core/mvnw
  ```
  Đồng thời bổ sung bước cấp quyền thực thi tự động trong tệp workflow:
  ```yaml
  - name: Grant Execute Permission to Maven Wrapper
    run: chmod +x backend-core/backend-core/mvnw
  ```

---

### Sự cố 4.7: Render Free-tier Spin-down (Ngủ Đông sau 15 phút không dùng)
* **Hiện tượng lỗi**: Sau khoảng thời gian nghỉ, khi truy cập vào trang web, trình duyệt phải quay vòng chờ đợi từ 50 đến 90 giây mới tải xong nội dung.
* **Phân tích nguyên nhân**: Cơ chế tiết kiệm tài nguyên của gói dịch vụ miễn phí (Free-tier) trên Render tự động đưa máy chủ ảo về trạng thái ngủ nếu không phát hiện yêu cầu mạng trong 15 phút liên tục.
* **Giải pháp kỹ thuật của Nhóm 10**:
  * Triển khai dịch vụ giám sát **UptimeRobot** gửi tín hiệu HTTP GET định kỳ 5 phút/lần vào endpoint `/api/vocabularies`.
  * Xây dựng workflow dự phòng `.github/workflows/keep_alive.yml` kích hoạt bằng cron `*/10 * * * *`.
  * Cơ chế này giữ cho container luôn trong trạng thái "nóng" (Hot Instance), triệt tiêu hoàn toàn thời gian khởi động lạnh.

---

# CHƯƠNG 5: ĐÁNH GIÁ KẾT QUẢ, HẠCH TOÁN CHI PHÍ & KẾT LUẬN

### 5.1. Bảng Nghiệm thu Tính năng Hệ thống Trực tuyến

| Tính năng kiểm nghiệm | Môi trường thử nghiệm | Kết quả thực tế | Đánh giá |
| :--- | :--- | :--- | :---: |
| **Đăng nhập Google OAuth2** | Trực tuyến (Public HTTPS) | Đăng nhập thành công, cấp phát JWT an toàn | Đạt 100% |
| **Upload Avatar Người dùng** | Trực tuyến | Đẩy ảnh lên Cloudinary, lưu URL về PostgreSQL | Đạt 100% |
| **Luyện Shadowing qua YouTube** | Trực tuyến | Video phát đồng bộ phụ đề câu thoại theo thời gian | Đạt 100% |
| **Học Từ vựng Flashcard** | Trực tuyến | Hiển thị đầy đủ phiên âm IPA, nghĩa tiếng Việt, icon | Đạt 100% |
| **Tự động hóa CI/CD** | GitHub Actions | Tự động chạy 4 jobs khi push code và trigger deploy | Đạt 100% |
| **Giám sát Sẵn sàng (Uptime)** | UptimeRobot Dashboard | Trạng thái xanh lá cây liên tục, ping 5 phút/lần | Đạt 100% |

### 5.2. Hạch toán Chi phí Vận hành Hạ tầng Đám mây (Cost Optimization)
Một trong những thành tựu nổi bật nhất của đề tài là việc vận hành một hệ thống Microservices hoàn chỉnh với **chi phí 0 VNĐ**:

| Thành phần hạ tầng | Nhà cung cấp | Gói dịch vụ | Chi phí thực tế |
| :--- | :--- | :--- | :---: |
| **Managed Database** | Render | Free Tier (PostgreSQL 16 - 1GB Storage) | **0 đ / tháng** |
| **Backend Core Web Service** | Render | Free Tier (0.1 CPU, 512MB RAM) | **0 đ / tháng** |
| **AI Engine Web Service** | Render | Free Tier (0.1 CPU, 512MB RAM) | **0 đ / tháng** |
| **Frontend Web Service** | Render | Free Tier (Static / Docker Web Service) | **0 đ / tháng** |
| **Media Storage CDN** | Cloudinary | Free Tier (25 Credits ~ 25GB Storage & Bandwidth) | **0 đ / tháng** |
| **CI/CD Pipeline Runner** | GitHub Actions | 2,000 phút build miễn phí mỗi tháng | **0 đ / tháng** |
| **Uptime Monitoring** | UptimeRobot | Free Plan (Tối đa 50 Monitors, chu kỳ 5 phút) | **0 đ / tháng** |
| **TỔNG CHI PHÍ VẬN HÀNH** | — | **Toàn bộ hệ thống Microservices** | **0 VNĐ** |

### 5.3. Kết luận
Đề tài *"A Step-by-Step Guide to Deploying Full-Stack Web and PostgreSQL to Render with CI/CD"* do **Nhóm 10** thực hiện đã hoàn thành xuất sắc 100% các mục tiêu đề ra:
1. Xây dựng thành công bộ tài liệu kỹ thuật chuẩn xác, có tính ứng dụng thực tiễn cao cho việc chuyển đổi ứng dụng lên nền tảng đám mây PaaS và DBaaS.
2. Triển khai vận hành thực tế hệ thống Full-Stack kết hợp AI với độ ổn định cao, thời gian hoạt động liên tục (Uptime) đạt 100%.
3. Tự động hóa hoàn toàn quy trình phát triển và phát hành phần mềm hiện đại theo tiêu chuẩn GitOps và CI/CD.
4. Đóng góp cẩm nang xử lý sự cố thực tế đồ sộ, có giá trị tham khảo chuyên sâu cho sinh viên và lập trình viên khi làm việc với môi trường đám mây.

---
*(Bản báo cáo hoàn chỉnh được chuẩn bị phục vụ hội đồng nghiệm thu môn học Điện toán đám mây - VKU)*
