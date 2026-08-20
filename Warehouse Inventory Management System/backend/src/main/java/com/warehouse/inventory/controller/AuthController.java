package com.warehouse.inventory.controller;

import com.warehouse.inventory.dto.AuthDtos.*;
import com.warehouse.inventory.dto.UserDtos.UserResponse;
import com.warehouse.inventory.entity.User;
import com.warehouse.inventory.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication auth) {
        User user = authService.currentUser(auth.getName());
        return ResponseEntity.ok(new UserResponse(user.getId(), user.getUsername(),
                user.getFullName(), user.getEmail(), user.getRole().name(), user.isActive()));
    }

    @PutMapping("/profile")
    public ResponseEntity<Void> updateProfile(Authentication auth,
                                              @Valid @RequestBody UpdateProfileRequest req) {
        authService.updateProfile(auth.getName(), req);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(Authentication auth,
                                               @Valid @RequestBody ChangePasswordRequest req) {
        authService.changePassword(auth.getName(), req);
        return ResponseEntity.noContent().build();
    }
}
