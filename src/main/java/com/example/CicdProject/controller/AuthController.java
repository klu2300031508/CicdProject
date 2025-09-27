package com.example.CicdProject.controller;

import com.example.CicdProject.model.UserAuth;
import com.example.CicdProject.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * User Registration (Sign Up)
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserAuth userAuth) {
        Map<String, Object> result = authService.registerUser(userAuth);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }
    
    /**
     * User Login
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String usernameOrEmail = loginRequest.get("usernameOrEmail");
        String password = loginRequest.get("password");
        
        if (usernameOrEmail == null || password == null) {
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Username/Email and password are required"
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
        
        Map<String, Object> result = authService.loginUser(usernameOrEmail, password);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }
    
    /**
     * Change Password
     */
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> passwordRequest) {
        Long userId = Long.parseLong(passwordRequest.get("userId"));
        String currentPassword = passwordRequest.get("currentPassword");
        String newPassword = passwordRequest.get("newPassword");
        
        Map<String, Object> result = authService.changePassword(userId, currentPassword, newPassword);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }
    
    /**
     * Get User Profile
     */
    @GetMapping("/profile/{userId}")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable Long userId) {
        Map<String, Object> result = authService.getUserProfile(userId);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }
    }
    
    /**
     * Validate Password Strength
     */
    @PostMapping("/validate-password")
    public ResponseEntity<Map<String, Object>> validatePassword(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        
        Map<String, Object> response = Map.of(
            "isValid", password != null && password.length() >= 8,
            "message", password != null ? 
                (password.length() >= 8 ? "Password is valid" : "Password must be at least 8 characters long") :
                "Password is required"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Check Username Availability
     */
    @GetMapping("/check-username/{username}")
    public ResponseEntity<Map<String, Object>> checkUsernameAvailability(@PathVariable String username) {
        // This would typically use a repository method to check availability
        Map<String, Object> response = Map.of(
            "available", true, // Placeholder - implement actual check
            "message", "Username is available"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Check Email Availability
     */
    @GetMapping("/check-email/{email}")
    public ResponseEntity<Map<String, Object>> checkEmailAvailability(@PathVariable String email) {
        // This would typically use a repository method to check availability
        Map<String, Object> response = Map.of(
            "available", true, // Placeholder - implement actual check
            "message", "Email is available"
        );
        
        return ResponseEntity.ok(response);
    }
}


