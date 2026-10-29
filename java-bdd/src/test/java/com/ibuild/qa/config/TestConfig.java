package com.ibuild.qa.config;

public final class TestConfig {
    private TestConfig() {}

    public static String value(String key, String fallback) {
        String property = System.getProperty(key);
        if (property != null && !property.isBlank()) return property;
        String env = System.getenv(key);
        return env == null || env.isBlank() ? fallback : env;
    }

    public static String webUrl() {
        return value("WEB_BASE_URL", "http://127.0.0.1:5173").replaceAll("/+$", "");
    }

    public static String apiUrl() {
        return value("API_BASE_URL", "http://127.0.0.1:3333").replaceAll("/+$", "");
    }

    public static String healthPath() {
        String path = value("API_HEALTH_PATH", "/health");
        return path.startsWith("/") ? path : "/" + path;
    }

    public static boolean headless() {
        return Boolean.parseBoolean(value("HEADLESS", "true"));
    }
}
