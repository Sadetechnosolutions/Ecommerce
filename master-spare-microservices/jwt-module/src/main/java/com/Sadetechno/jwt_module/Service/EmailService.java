package com.Sadetechno.jwt_module.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {


        private final JavaMailSender javaMailSender;
        private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

        @Autowired
        public EmailService(JavaMailSender javaMailSender) {
            this.javaMailSender = javaMailSender;
        }

        public void sendOtpEmail(String to, String otp) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your OTP Code");
            message.setText("Your OTP code is: " + otp);

            try {
                logger.info("Attempting to send email to: " + to);
                javaMailSender.send(message);
                logger.info("Email sent successfully to: " + to);
            } catch (MailException e) {
                logger.error("Failed to send email: " + e.getMessage(), e);
                throw new RuntimeException("Failed to send email", e);
            }
        }
    }
