package com.warehouse.inventory.config;

import com.warehouse.inventory.entity.Role;
import com.warehouse.inventory.entity.User;
import com.warehouse.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a default admin and staff account on first startup so the app is usable
 * immediately. Passwords should be changed after first login.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            userRepository.save(User.builder()
                    .username("admin")
                    .fullName("System Administrator")
                    .email("admin@warehouse.local")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build());
        }
        if (!userRepository.existsByUsername("staff")) {
            userRepository.save(User.builder()
                    .username("staff")
                    .fullName("Warehouse Staff")
                    .email("staff@warehouse.local")
                    .password(passwordEncoder.encode("staff123"))
                    .role(Role.STAFF)
                    .active(true)
                    .build());
        }
    }
}
