package com.flightapp.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flightapp.entity.ERole;
import com.flightapp.entity.Role;
import com.flightapp.entity.User;
import com.flightapp.payload.request.ChangePasswordRequest;
import com.flightapp.payload.request.LoginRequest;
import com.flightapp.payload.request.SignupRequest;
import com.flightapp.payload.response.JwtResponse;
import com.flightapp.payload.response.MessageResponse;
import com.flightapp.repository.RoleRepository;
import com.flightapp.repository.UserRepository;
import com.flightapp.security.jwt.JwtUtils;
import com.flightapp.security.service.UserImplementation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ReactiveAuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final long LOCK_TIME_DURATION_MIN = 15;
    private static final int PASSWORD_HISTORY_LIMIT = 5;

    @PostMapping("/signin")
    public Mono<ResponseEntity<Object>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return authenticationManager
            .authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()))
            .flatMap(authentication ->
                userRepository.findByUsername(loginRequest.getUsername()).flatMap(user -> {
                        boolean needsSave = false;
                        if (user.getFailedLoginAttempts() > 0) {
                            user.setFailedLoginAttempts(0);
                            needsSave = true;
                        }
                        if (user.getLockTime() != null) {
                            user.setLockTime(null);
                            needsSave = true;
                        }
                        Mono<User> userMono = needsSave ? userRepository.save(user): Mono.just(user);
                        
                        return userMono.map(u -> {
                            UserImplementation userDetails = (UserImplementation) authentication.getPrincipal();
                            String jwt = jwtUtils.generateJwtToken(authentication);
                            return ResponseEntity.ok( (Object) new JwtResponse(jwt,
                                    userDetails.getId(),
                                    userDetails.getUsername(),
                                    userDetails.getEmail(),
                                    userDetails.getAuthorities().stream().map(a -> a.getAuthority()).collect(Collectors.toList())
                            ));
                        });
                    })
            )
            .onErrorResume(BadCredentialsException.class, ex -> {
                return userRepository.findByUsername(loginRequest.getUsername())
                    .flatMap(user -> {
                        if (user.getLockTime() != null) {
                             if (user.getLockTime().plusMinutes(LOCK_TIME_DURATION_MIN).isAfter(LocalDateTime.now())) {
                                 return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                         .body((Object) new MessageResponse("Account is locked. Try again later.")));
                             }
                             user.setLockTime(null);
                             user.setFailedLoginAttempts(0);
                        }                        
                        
                        int currentAttempts = user.getFailedLoginAttempts(); 
                        int attempts = currentAttempts + 1;
                        user.setFailedLoginAttempts(attempts);                        
                        if (attempts >= MAX_FAILED_ATTEMPTS) {
                            user.setLockTime(LocalDateTime.now());
                            return userRepository.save(user)
                                .map(u -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body((Object) new MessageResponse("Max failed attempts reached. Account locked for 15 minutes.")));
                        }
                        
                        return userRepository.save(user)
                                .map(u -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body((Object) new MessageResponse("Invalid credentials. Attempt " + attempts + " of " + MAX_FAILED_ATTEMPTS)));
                    })
                    .switchIfEmpty(Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body((Object) new MessageResponse("Invalid credentials."))));
            });
    }

    @PostMapping("/signup")
    public Mono<ResponseEntity<Object>> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        Set<String> strRoles = signUpRequest.getRoles();
        boolean isAdminRequest = strRoles != null &&
                strRoles.stream().anyMatch(r -> r.equalsIgnoreCase("admin") || r.equalsIgnoreCase("ROLE_ADMIN"));
        Mono<Role> roleMono = isAdminRequest ? roleRepository.findByName(ERole.ROLE_ADMIN): roleRepository.findByName(ERole.ROLE_USER);
        String successMessage = isAdminRequest ? "Admin registered successfully!" : "User registered successfully!";
        
        return userRepository.existsByUsername(signUpRequest.getUsername())
            .flatMap(usernameExists -> {
                if (usernameExists)
                    return Mono.just(ResponseEntity.badRequest().body( (Object) new MessageResponse("Error: Username is already taken!")));
                return userRepository.existsByEmail(signUpRequest.getEmail())
                    .flatMap(emailExists -> {
                        if (emailExists) 
                            return Mono.just(ResponseEntity.badRequest().body( (Object) new MessageResponse("Error: Email is already in use!")));
                        User user = new User(
                                signUpRequest.getUsername(),
                                signUpRequest.getEmail(),
                                encoder.encode(signUpRequest.getPassword())
                        );
                        user.setPasswordHistory(new ArrayList<>());
                        user.getPasswordHistory().add(user.getPassword());
                        return roleMono
                            .switchIfEmpty(Mono.error(
                                    new RuntimeException("Error: Role not found")))
                            .flatMap(role -> {
                                Set<Role> roles = new HashSet<>();
                                roles.add(role);
                                user.setRoles(roles);
                                return userRepository.save(user);
                            })
                            .map(saved -> ResponseEntity.ok( (Object) new MessageResponse(successMessage)));
                    });
            });
    }

    @PostMapping("/change-password")
    public Mono<ResponseEntity<MessageResponse>> changePassword(@RequestBody ChangePasswordRequest request) {
        return userRepository.findByUsername(request.getUsername())
            .flatMap(user -> {
                if (encoder.matches(request.getNewPassword(), user.getPassword())) {
                    return Mono.just(ResponseEntity.badRequest()
                            .body(new MessageResponse(
                                    "Error: New password cannot be the same as the current one."
                            )));
                }
                if (user.getPasswordHistory() == null) {
                    user.setPasswordHistory(new ArrayList<>());
                }
                boolean usedBefore = user.getPasswordHistory().stream()
                        .anyMatch(old -> encoder.matches(request.getNewPassword(), old));
                if (usedBefore) {
                    return Mono.just(ResponseEntity.badRequest()
                            .body(new MessageResponse(
                                    "Error: You cannot reuse your last " +
                                    PASSWORD_HISTORY_LIMIT + " passwords."
                            )));
                }
                String newHash = encoder.encode(request.getNewPassword());
                user.getPasswordHistory().add(newHash);
                if (user.getPasswordHistory().size() > PASSWORD_HISTORY_LIMIT) {
                    user.getPasswordHistory().remove(0);
                }
                user.setPassword(newHash);
                user.setPasswordExpiryDate(LocalDateTime.now().plusDays(90));
                return userRepository.save(user)
                        .map(u -> ResponseEntity.ok(
                                new MessageResponse("Password updated successfully!")
                        ));
            })
            .switchIfEmpty(Mono.error(new RuntimeException("Error: User not found.")));
    }
}