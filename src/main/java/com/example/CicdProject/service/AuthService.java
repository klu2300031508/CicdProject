package com.example.CicdProject.service;

import com.example.CicdProject.model.UserAuth;
import com.example.CicdProject.repository.UserAuthRepository;
import com.example.CicdProject.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserAuthRepository userAuthRepository;
    
    @Autowired
    private PasswordUtil passwordUtil;
    
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_TIME_MINUTES = 30;
    
    /**
     * Register a new user
     */
    public Map<String, Object> registerUser(UserAuth userAuth) {
        Map<String, Object> response = new HashMap<>();
        
        // Validate password
        if (!passwordUtil.isValidPassword(userAuth.getPassword())) {
            response.put("success", false);
            response.put("message", passwordUtil.getPasswordValidationMessage(userAuth.getPassword()));
            return response;
        }
        
        // Check if username already exists
        if (userAuthRepository.existsByUsername(userAuth.getUsername())) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return response;
        }
        
        // Check if email already exists
        if (userAuthRepository.existsByEmail(userAuth.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return response;
        }
        
        // Hash password
        userAuth.setPassword(passwordUtil.hashPassword(userAuth.getPassword()));
        
        // Set default values
        userAuth.setIsActive(true);
        userAuth.setIsEmailVerified(false);
        userAuth.setRole("USER");
        userAuth.setFailedLoginAttempts(0);
        
        try {
            UserAuth savedUser = userAuthRepository.save(userAuth);
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("userId", savedUser.getId());
            response.put("username", savedUser.getUsername());
            response.put("email", savedUser.getEmail());
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
        }
        
        return response;
    }
    
    /**
     * Authenticate user login
     */
    public Map<String, Object> loginUser(String usernameOrEmail, String password) {
        Map<String, Object> response = new HashMap<>();
        
        // Find user by username or email
        Optional<UserAuth> userOpt = userAuthRepository.findByUsername(usernameOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userAuthRepository.findByEmail(usernameOrEmail);
        }
        
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid username/email or password");
            return response;
        }
        
        UserAuth user = userOpt.get();
        
        // Check if account is active
        if (!user.getIsActive()) {
            response.put("success", false);
            response.put("message", "Account is deactivated");
            return response;
        }
        
        // Check if account is locked
        if (user.getAccountLockedUntil() != null && user.getAccountLockedUntil().isAfter(LocalDateTime.now())) {
            response.put("success", false);
            response.put("message", "Account is temporarily locked due to multiple failed login attempts");
            return response;
        }
        
        // Verify password
        if (!passwordUtil.verifyPassword(password, user.getPassword())) {
            // Increment failed attempts
            userAuthRepository.incrementFailedLoginAttempts(user.getId());
            
            // Check if should lock account
            if (user.getFailedLoginAttempts() + 1 >= MAX_FAILED_ATTEMPTS) {
                LocalDateTime lockUntil = LocalDateTime.now().plusMinutes(LOCK_TIME_MINUTES);
                userAuthRepository.lockAccount(user.getId(), lockUntil);
                response.put("success", false);
                response.put("message", "Account locked due to multiple failed login attempts. Try again in " + LOCK_TIME_MINUTES + " minutes");
            } else {
                response.put("success", false);
                response.put("message", "Invalid username/email or password");
            }
            return response;
        }
        
        // Successful login - reset failed attempts and update last login
        userAuthRepository.resetFailedLoginAttempts(user.getId());
        userAuthRepository.updateLastLogin(user.getId(), LocalDateTime.now());
        
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("role", user.getRole());
        response.put("isEmailVerified", user.getIsEmailVerified());
        
        return response;
    }
    
    /**
     * Change user password
     */
    public Map<String, Object> changePassword(Long userId, String currentPassword, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<UserAuth> userOpt = userAuthRepository.findById(userId);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }
        
        UserAuth user = userOpt.get();
        
        // Verify current password
        if (!passwordUtil.verifyPassword(currentPassword, user.getPassword())) {
            response.put("success", false);
            response.put("message", "Current password is incorrect");
            return response;
        }
        
        // Validate new password
        if (!passwordUtil.isValidPassword(newPassword)) {
            response.put("success", false);
            response.put("message", passwordUtil.getPasswordValidationMessage(newPassword));
            return response;
        }
        
        // Update password
        user.setPassword(passwordUtil.hashPassword(newPassword));
        userAuthRepository.save(user);
        
        response.put("success", true);
        response.put("message", "Password changed successfully");
        return response;
    }
    
    /**
     * Get user profile
     */
    public Map<String, Object> getUserProfile(Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<UserAuth> userOpt = userAuthRepository.findById(userId);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }
        
        UserAuth user = userOpt.get();
        response.put("success", true);
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("phoneNumber", user.getPhoneNumber());
        response.put("role", user.getRole());
        response.put("isActive", user.getIsActive());
        response.put("isEmailVerified", user.getIsEmailVerified());
        response.put("lastLogin", user.getLastLogin());
        response.put("createdAt", user.getCreatedAt());
        
        return response;
    }
}


