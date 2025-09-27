package com.example.CicdProject.repository;

import com.example.CicdProject.model.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth, Long> {
    
    // Find user by username
    Optional<UserAuth> findByUsername(String username);
    
    // Find user by email
    Optional<UserAuth> findByEmail(String email);
    
    // Find active user by username
    Optional<UserAuth> findByUsernameAndIsActiveTrue(String username);
    
    // Find active user by email
    Optional<UserAuth> findByEmailAndIsActiveTrue(String email);
    
    // Check if username exists
    boolean existsByUsername(String username);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Check if username exists and is active
    boolean existsByUsernameAndIsActiveTrue(String username);
    
    // Check if email exists and is active
    boolean existsByEmailAndIsActiveTrue(String email);
    
    // Update last login time
    @Modifying
    @Query("UPDATE UserAuth u SET u.lastLogin = :lastLogin WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") Long userId, @Param("lastLogin") LocalDateTime lastLogin);
    
    // Reset failed login attempts
    @Modifying
    @Query("UPDATE UserAuth u SET u.failedLoginAttempts = 0, u.accountLockedUntil = null WHERE u.id = :userId")
    void resetFailedLoginAttempts(@Param("userId") Long userId);
    
    // Increment failed login attempts
    @Modifying
    @Query("UPDATE UserAuth u SET u.failedLoginAttempts = u.failedLoginAttempts + 1 WHERE u.id = :userId")
    void incrementFailedLoginAttempts(@Param("userId") Long userId);
    
    // Lock account
    @Modifying
    @Query("UPDATE UserAuth u SET u.accountLockedUntil = :lockUntil WHERE u.id = :userId")
    void lockAccount(@Param("userId") Long userId, @Param("lockUntil") LocalDateTime lockUntil);
    
    // Verify email
    @Modifying
    @Query("UPDATE UserAuth u SET u.isEmailVerified = true WHERE u.id = :userId")
    void verifyEmail(@Param("userId") Long userId);
    
    // Deactivate account
    @Modifying
    @Query("UPDATE UserAuth u SET u.isActive = false WHERE u.id = :userId")
    void deactivateAccount(@Param("userId") Long userId);
}


