package com.flightapp.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest {
	@NotBlank
	private String username;
	@NotBlank
	private String newPassword;
}
