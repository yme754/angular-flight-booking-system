package com.flightapp.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.security.web.server.SecurityWebFilterChain;
import com.flightapp.config.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;
@SpringBootTest(
    classes = {
        SecurityConfig.class, 
        HeaderSecurityFilter.class, 
        SecurityConfigTest.TestConfig.class 
    },
    properties = {
        "spring.cloud.discovery.enabled=false",
        "eureka.client.enabled=false",
        "spring.cloud.config.enabled=false",
        "flightapp.internal.jwt=test-secret"
    }
)
class SecurityConfigTest {
    @Autowired
    private ApplicationContext context;
    @EnableAutoConfiguration 
    static class TestConfig {
    }
    @Test
    void securityWebFilterChain_shouldLoadBean() {
        SecurityWebFilterChain chain = context.getBean(SecurityWebFilterChain.class);
        assertNotNull(chain);
    }
}