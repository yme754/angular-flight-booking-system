package com.flightapp.config;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.ExchangeFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class WebClientConfigTest {

    private final WebClientConfig config = new WebClientConfig();

    @Test
    void flightWebClient_shouldHaveCorrectBaseUrl() {
        WebClient client = config.flightWebClient();
        assertNotNull(client);
    }

    @Test
    void webClientBuilder_shouldAddAuthHeader_whenContextHasAuth() {
        WebClient.Builder builder = config.webClientBuilder();
        AtomicReference<ClientRequest> capturedRequest = new AtomicReference<>();
        ExchangeFunction mockExchange = request -> {
            capturedRequest.set(request);
            return Mono.just(ClientResponse.create(HttpStatus.OK).build());
        };
        WebClient client = builder.exchangeFunction(mockExchange).build();
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_USER");
        UsernamePasswordAuthenticationToken auth = 
            new UsernamePasswordAuthenticationToken("user", "pass", List.of(authority));
        Mono<Object> result = client.get()
                .uri("/test")
                .exchangeToMono(r -> Mono.empty()) 
                .contextWrite(ReactiveSecurityContextHolder.withAuthentication(auth));
        StepVerifier.create(result).verifyComplete();
        assertNotNull(capturedRequest.get());
        assertEquals("ROLE_USER", capturedRequest.get().headers().getFirst("X-Auth-Roles"));
    }

    @Test
    void webClientBuilder_shouldNotAddHeader_whenNoContext() {
        WebClient.Builder builder = config.webClientBuilder();
        AtomicReference<ClientRequest> capturedRequest = new AtomicReference<>();
        ExchangeFunction mockExchange = request -> {
            capturedRequest.set(request);
            return Mono.just(ClientResponse.create(HttpStatus.OK).build());
        };
        WebClient client = builder.exchangeFunction(mockExchange).build();
        Mono<Object> result = client.get()
                .uri("/test")
                .exchangeToMono(r -> Mono.empty());
        StepVerifier.create(result).verifyComplete();
        assertNotNull(capturedRequest.get());
        assertEquals(null, capturedRequest.get().headers().getFirst("X-Auth-Roles"));
    }
}