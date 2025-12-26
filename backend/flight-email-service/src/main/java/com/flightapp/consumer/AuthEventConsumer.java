package com.flightapp.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import com.flightapp.service.EmailSenderService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthEventConsumer {

    private final EmailSenderService emailSenderService;
    @KafkaListener(topics = "forgot_password_topic", groupId = "emailGroup")
    public void handleForgotPassword(String message) {
        try {
            String[] parts = message.split(",");
            if(parts.length >= 2) {
                String toEmail = parts[0];
                String resetLink = parts[1];
                
                String subject = "Reset Your Password - Flight App";
                String body = "Hello,\n\n" +
                        "We received a request to reset your password.\n" +
                        "Click the link below to set a new password:\n" + 
                        resetLink + "\n\n" +
                        "This link expires in 15 minutes.\n" +
                        "If you did not request this, please ignore this email.";

                emailSenderService.sendEmail(toEmail, subject, body);
                System.out.println("Forgot Password email sent to: " + toEmail);
            }
        } catch (Exception e) {
            System.err.println("Error sending forgot password email: " + e.getMessage());
        }
    }
    @KafkaListener(topics = "password_updated_topic", groupId = "emailGroup")
    public void handlePasswordUpdated(String email) {
        try {
            String subject = "Security Alert: Password Updated";
            String body = "Hello,\n\n" +
                    "Your Flight App password was successfully updated.\n" +
                    "You can now login with your new credentials.\n\n" +
                    "If this wasn't you, please contact support immediately.";

            emailSenderService.sendEmail(email, subject, body);
            System.out.println("Password update confirmation sent to: " + email);
        } catch (Exception e) {
            System.err.println("Error sending password update email: " + e.getMessage());
        }
    }
}