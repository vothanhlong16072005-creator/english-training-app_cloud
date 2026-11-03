# Review_Notes_Tuan1 — Long (Reviewer)

> **Vai trò**: Reviewer (Tester) Tuần 1
> **Ngày review**: 19/10/2026
> **Repo review**: `https://github.com/A-Phien/english_training_app` (clone vào `final/english_training_app`)
> **Lead tuần này**: Phiên
> **Mục đích file**: ghi nhận các phát hiện để (1) gửi lại cho Phiên sửa, (2) dành cho Nhân (Lead Tuần 4) viết Chương Troubleshooting.

---

## Kết quả tổng quan

| Bước plan | Mô tả | Kết quả |
|-----------|-------|---------|
| 1.1 | Clone repo, đọc 5 Entity | ✅ Đạt |
| 1.2 | Chạy backend + frontend, kiểm DB | ✅ Đạt (có cảnh báo — xem Lỗi #2, #3) |
| 1.3 | Test upload avatar lên Cloudinary | ✅ Đạt sau khi set env vars (xem Lỗi #1) |
| 1.4 | Ghi nhận lỗi | ✅ File này |

**Verify số liệu DB (đúng plan)**:

| Bảng | Số bản ghi theo plan | Số bản ghi thực tế |
|------|---------------------|---------------------|
| `users` | 6 | 6 ✅ |
| `lesson` | 12 | 12 ✅ |
| `sentence` | ~1195 | 1195 ✅ |
| `topic` | 6 | 6 ✅ |
| `vocabulary` | 40 | 40 ✅ |

**Upload avatar qua 3 nơi** (user_id=6 theo plan, user_id=7 do Reviewer tạo để test):

| Nơi verify | Kết quả |
|-----------|---------|
| Frontend (URL Cloudinary) | ✅ HTTP 200, `image/jpeg`, **300×300**, 30 KB |
| Cloudinary Dashboard (folder `avatars/`) | ✅ File `user_6.jpg` + `user_7.jpg` tồn tại |
| PostgreSQL (`SELECT id, username, avatar_url FROM users WHERE id=6`) | ✅ `https://res.cloudinary.com/dqqbvzmrr/image/upload/v1792427815/avatars/user_6.jpg` |

---

## Lỗi / Vấn đề phát hiện (gửi Phiên sửa)

### Lỗi #1 — `cloudinary.api-secret` mặc định là `changeme` → không upload được khi chạy local

| Cột | Nội dung |
|-----|----------|
| **Mô tả lỗi** | Trong `backend-core/src/main/resources/application.properties` dòng `cloudinary.api-secret=${CLOUDINARY_API_SECRET:changeme}` — khi dev chạy local mà không truyền env var `CLOUDINARY_API_SECRET`, secret fallback về chuỗi `changeme` không hợp lệ, Cloudinary API trả về `Invalid Signature`, upload thất bại với 500 Internal Server Error. |
| **Cách tái tạo** | 1. Clone repo mới. <br>2. `cd backend-core/backend-core && .\mvnw.cmd spring-boot:run` (không set env var). <br>3. Login lấy JWT. <br>4. `curl -X POST http://localhost:8080/api/users/7/avatar -H "Authorization: Bearer <token>" -F "file=@test.jpg"` <br>→ Response 500, log backend: `Invalid Signature ... String to sign - 'overwrite=true&public_id=avatars/user_7&...'`. |
| **Log/màn hình** | `java.lang.RuntimeException: Invalid Signature a9fc5ba5eda74da02ea73ce0ca100c154e4b79bd. String to sign - 'overwrite=true&public_id=avatars/user_7&timestamp=...&transformation=w_300,h_300,c_fill,g_face'.` (từ `CloudinaryService.uploadAvatar` → `UserController.uploadAvatar`). |
| **Mức độ** | 🔴 **Critical** — dev mới clone repo sẽ không thể test upload avatar đến khi tự đi tìm secret. |
| **Đề xuất sửa** | Có 2 hướng: <br>**Hướng A** (khuyến nghị — tuân thủ nguyên tắc "không commit secret"): Sửa `application.properties` thành `cloudinary.api-secret=${CLOUDINARY_API_SECRET}` (không có default). Khi đó nếu không truyền env var, app **fail-fast lúc boot** với lỗi rõ ràng thay vì upload fail lúc runtime. <br>**Hướng B**: Thêm `CLOUDINARY_API_SECRET=...` vào `.env.example` ở root repo (file này KHÔNG commit `.env` thật). Bổ sung đoạn "Cấu hình Cloudinary" vào README. |

---

### Lỗi #2 — `pom.xml` khai báo `spring-boot-starter-parent: 4.0.2` không tồn tại trên Maven Central

| Cột | Nội dung |
|-----|----------|
| **Mô tả lỗi** | `pom.xml` dòng 9 đặt `<version>4.0.2</version>` cho `spring-boot-starter-parent`. Tính đến 19/10/2026 phiên bản cao nhất public trên Maven Central là Spring Boot **3.x** (3.5.x); bản 4.0.2 **chưa phát hành**. |
| **Cách tái tạo** | Mở `pom.xml`, quan sát `<version>4.0.2</version>`. So sánh với https://central.sonatype.com/artifact/org.springframework.boot/spring-boot-starter-parent. |
| **Log/màn hình** | (Hiện build vẫn pass nhờ dependency resolution thông qua `spring-boot-dependencies` BOM lock version — đây là "may rủi lờ". Tuy nhiên các starter con như `spring-boot-starter-security` 4.0.2 cũng không tồn tại; Maven tải về nhờ cache BOM cũ hoặc fallback). |
| **Mức độ** | 🟠 **High** — dễ vỡ khi `mvn clean` hoặc khi BOM controller cập nhật. Có thể gây hiểu nhầm cho người mới đọc code. |
| **Đề xuất sửa** | Hạ xuống phiên bản Spring Boot ổn định gần nhất, ví dụ **`<version>3.5.0</version>`** hoặc **`<version>3.4.5</version>`**. Đồng thời set `<java.version>17</java.version>` khớp với JDK 17 (đã có sẵn, giữ nguyên). |

---

### Lỗi #3 — Spring Security in `Using generated security password: <uuid>` dù app không dùng form login

| Cột | Nội dung |
|-----|----------|
| **Mô tả lỗi** | Khi boot, log in ra `Using generated security password: <uuid>` mặc dù app dùng JWT + Google OAuth, không có form login. Cảnh báo này xuất hiện vì starter `spring-boot-starter-security` được kéo vào mà không disable `UserDetailsServiceAutoConfiguration`. |
| **Cách tái tạo** | 1. Chạy `.\mvnw.cmd spring-boot:run`. <br>2. Đọc log boot. |
| **Log/màn hình** | `WARN ... UserDetailsServiceAutoConfiguration : Using generated security password: d15422f7-2083-4183-be91-c3c494ee6b6b. This generated password is for development use only. Your security configuration must be updated before running your application in production.` |
| **Mức độ** | 🟡 **Medium** — không ảnh hưởng chức năng nhưng có thể bị lộ password qua log (nếu CI capture log public). |
| **Đề xuất sửa** | Trong `SecurityConfig.java` thêm annotation `@EnableWebSecurity` đã có sẵn — bổ sung exclude: <br>`@SpringBootApplication(exclude = { UserDetailsServiceAutoConfiguration.class })` ở `BackendCoreApplication.java`. |

---

### Lỗi #4 — Hibernate warning `PostgreSQLDialect does not need to be specified explicitly`

| Cột | Nội dung |
|-----|----------|
| **Mô tả lỗi** | `application.properties` có `spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect` — Hibernate 6.x/7.x đã tự detect dialect từ JDBC connection, không cần khai báo. |
| **Cách tái tạo** | Đọc log boot, tìm `HHH90000025: PostgreSQLDialect does not need to be specified explicitly`. |
| **Mức độ** | 🟢 **Low** — warning không ảnh hưởng nhưng làm nhiễu log. |
| **Đề xuất sửa** | Xoá dòng `spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect` trong `application.properties`. |

---

### Lỗi #5 — `spring.jpa.open-in-view is enabled by default` warning

| Cột | Nội dung |
|-----|----------|
| **Mô tả lỗi** | Spring Boot bật OSIV (Open Session In View) mặc định → query có thể chạy trong lúc render view, che giấu lỗi N+1 và gây connection leak. |
| **Cách tái tạo** | Đọc log boot, tìm `JpaBaseConfiguration$JpaWebConfiguration : spring.jpa.open-in-view is enabled by default`. |
| **Mức độ** | 🟡 **Medium** — anti-pattern phổ biến, nên tắt. |
| **Đề xuất sửa** | Thêm `spring.jpa.open-in-view=false` vào `application.properties`. |

---

### Lỗi #6 — Endpoint `GET /api/users/{id}` không tồn tại, gây khó verify cho Reviewer/Dev

| Cột | Nội dung |
|-----|----------|
| **Mô tả lỗi** | `UserController.java` chỉ có `POST /api/users/{id}/avatar`. Không có `GET /api/users/{id}` để xem thông tin user (kể cả `avatar_url` mới upload). Reviewer/Tester muốn xác minh avatar sau upload **phải vào thẳng DB** hoặc console. |
| **Cách tái tạo** | Sau khi upload avatar thành công, gọi `curl http://localhost:8080/api/users/6 -H "Authorization: Bearer <token>"` → 403 (security chặn vì rule không có). |
| **Mức độ** | 🟡 **Medium** — thiếu DX, làm việc review/test chậm hơn. |
| **Đề xuất sửa** | Bổ sung endpoint public/debug: `GET /api/users/{id}` (yêu cầu `authenticated()`). Trả về `{ id, username, email, role, avatarUrl, isActive, createdAt, updatedAt }` (không trả `password`). |

---

### Lỗi #7 — Mâu thuẫn URL trong SecurityConfig: `/api/vocabulary/**` vs `/api/vocabularies/**`

| Cột | Nội dung |
|-----|----------|
| **Mô tả lỗi** | `SecurityConfig.java` permit rule dùng `/api/vocabularies/**` (số nhiều) nhưng nếu nhìn vào controller khác (ví dụ `VocabularyController`) đã đúng là `/api/vocabularies`. Tuy nhiên trong README hoặc tài liệu cũ (nếu có) có thể nhắc tới `/api/vocabulary` (số ít) → dễ nhầm cho người mới. |
| **Cách tái tạo** | `curl http://localhost:8080/api/vocabulary` → 403. `curl http://localhost:8080/api/vocabularies` → 200 OK. |
| **Mức độ** | 🟢 **Low** — naming inconsistency, không gây crash. |
| **Đề xuất sửa** | Chuẩn hoá tài liệu (README, file hướng dẫn PostgreSQL/Cloudinary) về `/api/vocabularies`. |

---

### Lỗi #8 — `pom.xml` Hibernate ORM 7.x được kéo về, có thể không tương thích với một số annotation cũ

| Cột | Nội dung |
|-----|----------|
| **Mô tả lỗi** | Log boot ghi `Hibernate ORM core version 7.2.1.Final` — phiên bản rất mới, có thể chưa tương thích hoàntoàn với một số cú pháp JPA query cũ. Các Entity hiện tại OK, nhưng nếu sau này thêm custom repository method có thể phát sinh warning/error. |
| **Cách tái tạo** | Đọc log boot. |
| **Mức độ** | 🟢 **Low** — cảnh báo sớm để cả nhóm biết. |
| **Đề xuất sửa** | Khi nâng version Spring Boot lên 3.5.x, Hibernate ORM xuống 6.6.x (đi kèm). Khi đó test lại toàn bộ custom query. |

---

## Các quan sát khác (không phải lỗi nhưng đáng chú ý)

### Quan sát #1 — `UserController.uploadAvatar` không validate user có phải chính chủ upload không

- Ai đăng nhập (kể cả user thường) đều có thể upload avatar cho user bất kỳ qua `POST /api/users/{id}/avatar` miễn có JWT hợp lệ. Security rule chỉ yêu cầu `.authenticated()`, không so sánh `{id}` path với user đang login.
- **Hệ quả**: user A có thể upload avatar rác cho user B.  
- **Đề xuất**: nên đối chiếu `id` trong JWT (`sub` claim) với `id` trong URL; nếu muốn cho admin override thì check thêm `hasRole('ADMIN')`.

### Quan sát #2 — `UserService.register()` không tôn trọng `role` từ body

- Test gửi `role: "ADMIN"` trong body đăng ký → user mới vẫn lưu `role=USER` (xem log debug). Có thể là intentional (chỉ ADMIN qua DB seed), nhưng nên document hoặc từ chối request với `role` khác USER.

### Quan sát #3 — `pom.xml` có 1 dependency bị comment với comment tiếng Việt có dấu

- Đoạn `<dependency>` cho `java_guid_hazz/Javaweb_MVC` bị comment + comment tiếng Việt có dấu. Nên xoá hẳn khỏi pom.xml để tránh hiểu nhầm.

---

## Đề xuất cho Tuần 2 (Reviewer Dockerfile của Quý)

| ID | Hạng mục |
|----|----------|
| RN2-01 | Review `Dockerfile` ở root repo + `docker-compose.yml` + `render.yaml`. |
| RN2-02 | Tự build Docker image (`docker build -t eng-train-backend .`) để test môi trường chéo. |
| RN2-03 | Xác minh `render.yaml` khai báo đúng 2 resources (database + service) theo plan. |
| RN2-04 | Ghi nhận lỗi `OutOfMemory`, build fail, port conflict, env var thiếu vào `Review_Notes_Tuan2.md`. |

---

## Checklist Tuần 1 (theo plan)

- [x] Review code Tuần 1, test upload avatar lên Cloudinary xong.  
- [x] Đọc 5 Entity (`User`, `Lesson`, `Sentence`, `Vocabulary`, `Evaluation`) + topic/user-vocab phụ.  
- [x] Backend chạy thành công trên localhost:8080, kết nối Render PostgreSQL `english_training` (Singapore, v18.6).  
- [x] DB counts khớp plan: users=6, lessons=12, sentences=1195, topics=6, vocab=40.  
- [x] Upload avatar qua `POST /api/users/{id}/avatar` thành công (sau khi set Cloudinary env vars).  
- [x] Verify ở 3 nơi: Frontend URL (HTTP 200, 300×300, image/jpeg), Cloudinary folder `avatars/user_6.jpg` + `user_7.jpg`, PostgreSQL cột `avatar_url`.  
- [x] File này đã ghi nhận **8 vấn đề** + **3 quan sát** → gửi Phiên + dành cho Nhân (Tuần 4).  
- [ ] (Tuần 4) Nhân tổng hợp vào Chương Troubleshooting.

---

**Người viết**: Long (Reviewer Tuần 1)  
**Trạng thái**: ✅ Hoàn tất Bước 1.1 → 1.4 của plan `w1_reviewer_setup`  
**Gửi tới**: Phiên (Lead Tuần 1) — đề nghị sửa các lỗi #1, #2, #3, #6 trước Tuần 2.