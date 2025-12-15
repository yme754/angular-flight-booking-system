package com.flightapp.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class HeaderSecurityFilterTest {

    private final HeaderSecurityFilter filter = new HeaderSecurityFilter();

    @Test
    void filter_shouldAddAuthentication_whenHeaderIsPresent() {
        MockServerHttpRequest request = MockServerHttpRequest.get("/")
                .header("X-Auth-Roles", "ROLE_USER,ROLE_ADMIN")
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);
        WebFilterChain chain = (ex) -> ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .doOnNext(auth -> {
                    assertEquals("gateway-user", auth.getPrincipal());
                    assertEquals(2, auth.getAuthorities().size());
                    assertTrue(auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
                })
                .switchIfEmpty(Mono.error(new AssertionError("SecurityContext is missing!")))
                .then(); 
        StepVerifier.create(filter.filter(exchange, chain))
                .verifyComplete();
    }

    @Test
    void filter_shouldDoNothing_whenHeaderIsMissing() {
        MockServerHttpRequest request = MockServerHttpRequest.get("/").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);
        WebFilterChain chain = (ex) -> ReactiveSecurityContextHolder.getContext()
                .flatMap(ctx -> Mono.error(new AssertionError("SecurityContext should NOT be present!")))
                .switchIfEmpty(Mono.empty())
                .then();
        StepVerifier.create(filter.filter(exchange, chain)).verifyComplete();
    }
}