package com.flightapp.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.security.web.server.SecurityWebFilterChain;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(properties = {
    "spring.cloud.discovery.enabled=false",
    "eureka.client.enabled=false",
    "spring.cloud.config.enabled=false"
})
class SecurityConfigTest {
    @Autowired
    private ApplicationContext context;

    @Test
    void securityWebFilterChain_shouldLoadBean() {
        SecurityWebFilterChain chain = context.getBean(SecurityWebFilterChain.class);
        assertNotNull(chain);
    }
}