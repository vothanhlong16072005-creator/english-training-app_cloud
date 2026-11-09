package com.example.backend_core.config;

import com.example.backend_core.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

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
                log.info("Database is empty on Render. Automatically seeding initial lessons, sentences, topics, and vocabularies...");
                ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
                populator.setSqlScriptEncoding("UTF-8");
                populator.setContinueOnError(true);
                populator.addScript(new ClassPathResource("seed_data.sql"));
                populator.execute(dataSource);
                log.info("Database seeding completed successfully! Total lessons now: {}", lessonRepository.count());
            }
        } catch (Exception e) {
            log.warn("Database auto-seeding encountered an issue: {}", e.getMessage());
        }
    }
}
