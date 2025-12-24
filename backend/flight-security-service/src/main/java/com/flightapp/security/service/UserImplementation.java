package com.flightapp.security.service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.flightapp.entity.User;

public class UserImplementation implements UserDetails {
    private static final long serialVersionUID = 1L;
    private String id;
    private String username;
    private String email;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;    
    private boolean isAccountNonLocked;
    private boolean isCredentialsNonExpired;

    public UserImplementation(String id, String username, String email, String password,
            Collection<? extends GrantedAuthority> authorities, boolean isAccountNonLocked, boolean isCredentialsNonExpired) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.isAccountNonLocked = isAccountNonLocked;
        this.isCredentialsNonExpired = isCredentialsNonExpired;
    }

    public static UserImplementation build(User user) {
        List<GrantedAuthority> authorities = (user.getRoles() == null) ? List.of() : 
            user.getRoles().stream()
                .filter(role -> role != null && role.getName() != null)
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        boolean locked = false;
        if (user.getLockTime() != null) {
            if (user.getLockTime().plusMinutes(15).isAfter(LocalDateTime.now())) {
                locked = true;
            }
        }
        boolean expired = false;
        if (user.getPasswordExpiryDate() != null && user.getPasswordExpiryDate().isBefore(LocalDateTime.now())) {
            expired = true;
        }

        return new UserImplementation(
                user.getId(), 
                user.getUsername(), 
                user.getEmail(),
                user.getPassword(), 
                authorities,
                !locked,
                !expired);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public String getId() { 
        return id; 
    }
    
    public String getEmail() { 
        return email; 
    }

    @Override
    public String getPassword() { 
        return password; 
    }

    @Override
    public String getUsername() { 
        return username; 
    }
    
    @Override
    public boolean isAccountNonExpired() { 
        return true; 
    }

    @Override
    public boolean isAccountNonLocked() { 
        return this.isAccountNonLocked; 
    }

    @Override
    public boolean isCredentialsNonExpired() { 
        return this.isCredentialsNonExpired; 
    }

    @Override
    public boolean isEnabled() { 
        return true; 
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserImplementation user = (UserImplementation) o;
        return Objects.equals(id, user.id);
    }
}