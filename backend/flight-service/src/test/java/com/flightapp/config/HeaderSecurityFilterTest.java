package com.flightapp.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class HeaderSecurityFilterTest {

    private final HeaderSecurityFilter filter = new HeaderSecurityFilter();

    @BeforeEach
    void setup() {
        ReflectionTestUtils.setField(filter, "internalJwt", "secret123");
    }

    @Test
    void testInternalJwtAuth() {
        MockServerHttpRequest request = MockServerHttpRequest.get("/")
                .header("Authorization", "Bearer secret123")
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        WebFilterChain chain = (ex) -> ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .doOnNext(auth -> {
                    assertEquals("internal-service", auth.getPrincipal());
                    assertTrue(auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_INTERNAL")));
                })
                .then();

        StepVerifier.create(filter.filter(exchange, chain)).verifyComplete();
    }

    @Test
    void testRoleAuth() {
        MockServerHttpRequest request = MockServerHttpRequest.get("/")
                .header("X-Auth-Roles", "ROLE_USER,ROLE_ADMIN")
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        WebFilterChain chain = (ex) -> ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .doOnNext(auth -> {
                    assertEquals("gateway-user", auth.getPrincipal());
                    assertEquals(2, auth.getAuthorities().size());
                })
                .then();

        StepVerifier.create(filter.filter(exchange, chain)).verifyComplete();
    }

    @Test
    void testNoHeaders() {
        MockServerHttpRequest request = MockServerHttpRequest.get("/").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        WebFilterChain chain = (ex) -> ReactiveSecurityContextHolder.getContext()
                .switchIfEmpty(Mono.empty())
                .flatMap(ctx -> Mono.error(new AssertionError("Should not have context"))).then();
        StepVerifier.create(filter.filter(exchange, chain)).verifyComplete();
    }
}