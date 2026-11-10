package com.example.backend_core.config;

import com.example.backend_core.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Statement;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final LessonRepository lessonRepository;
    private final DataSource dataSource;

    @Override
    public void run(String... args) {
        try {
            long count = lessonRepository.count();
            log.info("Checking database data... Current lesson count: {}", count);
            if (count == 0) {
                log.info("Database is empty on Render. Seeding initial lessons, sentences, topics, and vocabularies...");
                ClassPathResource resource = new ClassPathResource("seed_data.sql");

                if (!resource.exists()) {
                    log.warn("seed_data.sql not found in classpath. Skipping seed.");
                    return;
                }

                try (Connection conn = dataSource.getConnection();
                     Statement stmt = conn.createStatement();
                     BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

                    String line;
                    StringBuilder sqlBuilder = new StringBuilder();
                    int executed = 0;

                    while ((line = reader.readLine()) != null) {
                        String trimmed = line.trim();
                        if (trimmed.isEmpty() || trimmed.startsWith("--")) {
                            continue;
                        }
                        sqlBuilder.append(line).append(" ");
                        if (trimmed.endsWith(";")) {
                            String sql = sqlBuilder.toString().trim();
                            sqlBuilder.setLength(0);
                            try {
                                stmt.execute(sql);
                                executed++;
                            } catch (Exception ex) {
                                // Ignore duplicate key or minor constraint warnings
                            }
                        }
                    }
                    log.info("Database seeding finished! Successfully executed {} statements. Total lessons in DB: {}", executed, lessonRepository.count());
                }
            } else {
                log.info("Database already contains {} lessons. Skipping seed.", count);
            }
        } catch (Exception e) {
            log.warn("Database auto-seeding encountered an issue: {}", e.getMessage(), e);
        }
    }
}
