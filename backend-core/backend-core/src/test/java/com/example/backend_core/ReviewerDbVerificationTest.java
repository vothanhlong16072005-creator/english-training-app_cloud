package com.example.backend_core;

import com.example.backend_core.model.User;
import com.example.backend_core.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Reviewer test (Long - Tuần 1): xác minh avatar_url đã được lưu vào DB
 * sau khi gọi POST /api/users/{id}/avatar.
 * Test này dùng connection string production (Render PostgreSQL)
 * được cấu hình sẵn trong application.properties.
 */
@SpringBootTest
class ReviewerDbVerificationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void user6_shouldHaveCloudinaryAvatarUrl() {
        Optional<User> opt = userRepository.findById(6L);
        assertTrue(opt.isPresent(), "User id=6 phải tồn tại");
        User u = opt.get();
        System.out.println(">>> [REVIEWER] User 6:");
        System.out.println(">>>   id          = " + u.getId());
        System.out.println(">>>   username    = " + u.getUsername());
        System.out.println(">>>   email       = " + u.getEmail());
        System.out.println(">>>   role        = " + u.getRole());
        System.out.println(">>>   avatar_url  = " + u.getAvatarUrl());

        assertNotNull(u.getAvatarUrl(), "avatar_url không được null sau khi upload");
        assertTrue(u.getAvatarUrl().startsWith("https://res.cloudinary.com/dqqbvzmrr/"),
                "avatar_url phải bắt đầu bằng https://res.cloudinary.com/dqqbvzmrr/");
        assertTrue(u.getAvatarUrl().contains("/avatars/user_6"),
                "avatar_url phải chứa /avatars/user_6");
    }

    @Test
    void user7_shouldHaveCloudinaryAvatarUrl() {
        Optional<User> opt = userRepository.findById(7L);
        assertTrue(opt.isPresent(), "User id=7 phải tồn tại");
        User u = opt.get();
        System.out.println(">>> [REVIEWER] User 7 (upload test):");
        System.out.println(">>>   id          = " + u.getId());
        System.out.println(">>>   username    = " + u.getUsername());
        System.out.println(">>>   avatar_url  = " + u.getAvatarUrl());

        assertNotNull(u.getAvatarUrl());
        assertTrue(u.getAvatarUrl().startsWith("https://res.cloudinary.com/dqqbvzmrr/"));
        assertTrue(u.getAvatarUrl().contains("/avatars/user_7"));
    }

    @Test
    void allTables_shouldHaveExpectedCounts() {
        long userCount      = userRepository.count();
        System.out.println(">>> [REVIEWER] users count = " + userCount);
        // plan yêu cầu users = 6
        assertEquals(6, userCount, "users count phải = 6 theo plan");
    }
}