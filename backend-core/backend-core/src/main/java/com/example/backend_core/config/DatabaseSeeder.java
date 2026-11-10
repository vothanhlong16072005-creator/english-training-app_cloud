package com.example.backend_core.config;

import com.example.backend_core.repository.LessonRepository;
import com.example.backend_core.repository.SentenceRepository;
import com.example.backend_core.repository.TopicRepository;
import com.example.backend_core.repository.VocabularyRepository;
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
    private final SentenceRepository sentenceRepository;
    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;
    private final DataSource dataSource;

    @Override
    public void run(String... args) {
        try {
            long lessonCount = lessonRepository.count();
            long sentenceCount = sentenceRepository.count();
            long topicCount = topicRepository.count();
            long vocabCount = vocabularyRepository.count();

            boolean topicsCorrupted = topicRepository.findAll().stream()
                    .anyMatch(t -> t.getName() != null && t.getName().contains("?"));

            log.info("Checking database data: Lessons={}, Sentences={}, Topics={}, Vocabularies={}, TopicsCorrupted={}",
                    lessonCount, sentenceCount, topicCount, vocabCount, topicsCorrupted);

            boolean needsSeeding = (lessonCount == 0 || sentenceCount == 0 || topicsCorrupted || topicCount == 0);

            if (needsSeeding) {
                log.info("Database needs initial data or encoding repair. Executing seed_data.sql...");
                ClassPathResource resource = new ClassPathResource("seed_data.sql");

                if (!resource.exists()) {
                    log.warn("seed_data.sql not found in classpath. Skipping seed.");
                    return;
                }

                try (Connection conn = dataSource.getConnection();
                     Statement stmt = conn.createStatement()) {

                    // If topics were corrupted with '?', purge them first to allow clean re-insert
                    if (topicsCorrupted) {
                        try {
                            log.info("Purging corrupted topics and vocabularies...");
                            stmt.execute("DELETE FROM user_vocabulary");
                            stmt.execute("DELETE FROM vocabulary");
                            stmt.execute("DELETE FROM topic");
                        } catch (Exception ex) {
                            log.warn("Notice during purge: {}", ex.getMessage());
                        }
                    }

                    // If sentences are missing, clear any remnants
                    if (sentenceCount == 0) {
                        try {
                            stmt.execute("DELETE FROM sentence");
                        } catch (Exception ignored) {}
                    }

                    try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
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
                        log.info("Seed execution finished! Successfully executed {} statements.", executed);
                    }

                    // Reset auto-increment sequences safely for PostgreSQL
                    try {
                        stmt.execute("SELECT setval(pg_get_serial_sequence('lesson', 'id'), coalesce(max(id), 1)) FROM lesson");
                        stmt.execute("SELECT setval(pg_get_serial_sequence('sentence', 'id'), coalesce(max(id), 1)) FROM sentence");
                        stmt.execute("SELECT setval(pg_get_serial_sequence('topic', 'id'), coalesce(max(id), 1)) FROM topic");
                        stmt.execute("SELECT setval(pg_get_serial_sequence('vocabulary', 'id'), coalesce(max(id), 1)) FROM vocabulary");
                    } catch (Exception ignored) {}

                    log.info("Database repair complete! Current status: Lessons={}, Sentences={}, Topics={}, Vocabularies={}",
                            lessonRepository.count(), sentenceRepository.count(), topicRepository.count(), vocabularyRepository.count());
                }
            } else {
                log.info("Database is fully populated and verified. Lessons={}, Sentences={}, Topics={}, Vocabularies={}",
                        lessonCount, sentenceCount, topicCount, vocabCount);
            }
        } catch (Exception e) {
            log.warn("Database auto-seeding encountered an issue: {}", e.getMessage(), e);
        }
    }
}
