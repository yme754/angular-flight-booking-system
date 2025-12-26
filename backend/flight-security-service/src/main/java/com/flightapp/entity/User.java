package com.flightapp.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
	@Id
	private String id;
	@NotBlank
	@Size(max = 20)
	private String username;
	@NotBlank
	@Size(max = 50)
	@Email
	private String email;
	@NotBlank
	@Size(max = 120)
	private String password;
	@DBRef
	private Set<Role> roles = new HashSet<>();
	private int failedLoginAttempts = 0;
    private LocalDateTime lockTime = null;
    private LocalDateTime passwordExpiryDate;
    private String resetToken;
    private LocalDateTime resetTokenExpiry;
    private List<String> passwordHistory = new ArrayList<>();
	public User(String username, String email, String password) {
	  this.username = username;
	  this.email = email;
	  this.password = password;
	  this.passwordExpiryDate = LocalDateTime.now().plusDays(90);
	}
}
