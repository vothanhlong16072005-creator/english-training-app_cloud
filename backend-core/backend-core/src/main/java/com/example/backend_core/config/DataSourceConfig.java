package com.example.backend_core.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:#{null}}")
    private String springUrl;

    @Value("${SPRING_DATASOURCE_URL:#{null}}")
    private String envSpringUrl;

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrl;

    @Value("${spring.datasource.username:#{null}}")
    private String defaultUsername;

    @Value("${spring.datasource.password:#{null}}")
    private String defaultPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String rawUrl = envSpringUrl;
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = databaseUrl;
        }
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = springUrl;
        }

        log.info("Configuring DataSource. Initial raw URL present: {}", (rawUrl != null && !rawUrl.isBlank()));

        String username = defaultUsername;
        String password = defaultPassword;
        String jdbcUrl = rawUrl;

        if (rawUrl != null && (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://"))) {
            try {
                String uriString = rawUrl;
                if (uriString.startsWith("postgresql://")) {
                    uriString = "postgres://" + uriString.substring("postgresql://".length());
                }
                URI uri = new URI(uriString);

                String host = uri.getHost();
                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String path = uri.getPath();
                String dbName = (path != null && path.length() > 1) ? path.substring(1) : "english_training";

                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] credentials = userInfo.split(":", 2);
                    username = credentials[0];
                    password = credentials[1];
                }

                jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbName;
                if (uri.getQuery() != null && !uri.getQuery().isBlank()) {
                    jdbcUrl += "?" + uri.getQuery();
                } else {
                    jdbcUrl += "?sslmode=require";
                }

                log.info("Converted Render connectionString to JDBC URL: jdbc:postgresql://{}:{}/{}", host, port, dbName);
            } catch (Exception e) {
                log.warn("Failed to parse URI from raw connection string, falling back to prefix replacement: {}", e.getMessage());
                if (rawUrl.startsWith("postgres://")) {
                    jdbcUrl = rawUrl.replace("postgres://", "jdbc:postgresql://");
                } else if (rawUrl.startsWith("postgresql://")) {
                    jdbcUrl = rawUrl.replace("postgresql://", "jdbc:postgresql://");
                }
            }
        }

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(jdbcUrl);
        if (username != null && !username.isBlank()) {
            ds.setUsername(username);
        }
        if (password != null && !password.isBlank()) {
            ds.setPassword(password);
        }
        ds.setDriverClassName("org.postgresql.Driver");

        // Connection pool tuning for Render Free Tier (512MB RAM)
        ds.setMaximumPoolSize(5);
        ds.setMinimumIdle(1);
        ds.setIdleTimeout(300000);
        ds.setConnectionTimeout(20000);

        return ds;
    }
}

