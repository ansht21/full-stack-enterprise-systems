package com.warehouse.config;

import com.warehouse.entity.Role;
import com.warehouse.entity.User;
import com.warehouse.repository.RoleRepository;
import com.warehouse.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ADMIN", "Administrator with full access")));

        Role staffRole = roleRepository.findByName("STAFF")
                .orElseGet(() -> roleRepository.save(new Role("STAFF", "Staff with limited access")));

        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@warehouse.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setRole(adminRole);
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("staff")) {
            User staff = new User();
            staff.setUsername("staff");
            staff.setEmail("staff@warehouse.com");
            staff.setPassword(passwordEncoder.encode("staff123"));
            staff.setFullName("Warehouse Staff");
            staff.setRole(staffRole);
            userRepository.save(staff);
        }

        System.out.println("=== Default users created: admin/admin123, staff/staff123 ===");
    }
}
