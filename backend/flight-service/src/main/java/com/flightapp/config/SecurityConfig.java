package com.flightapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.security.web.server.authentication.HttpStatusServerEntryPoint;

@Configuration
@EnableReactiveMethodSecurity
public class SecurityConfig {
    private final HeaderSecurityFilter headerSecurityFilter;
    public SecurityConfig(HeaderSecurityFilter headerSecurityFilter) {
        this.headerSecurityFilter = headerSecurityFilter;
    }
        @Bean
        public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
            ServerAuthenticationEntryPoint entryPoint = new HttpStatusServerEntryPoint(HttpStatus.UNAUTHORIZED);
            return http.csrf(csrf -> csrf.disable())
                    .httpBasic(basic -> basic.disable())
                    .formLogin(form -> form.disable())
                    .authorizeExchange(ex -> ex
                            .pathMatchers("/actuator/**").permitAll()
                            .anyExchange().authenticated())
                    .exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint))
                    .addFilterAt(headerSecurityFilter, SecurityWebFiltersOrder.AUTHENTICATION).build();
    }
}