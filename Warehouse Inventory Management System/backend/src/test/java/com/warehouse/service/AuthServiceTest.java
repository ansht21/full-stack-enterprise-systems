package com.warehouse.service;

import com.warehouse.dto.AuthResponse;
import com.warehouse.dto.LoginRequest;
import com.warehouse.dto.RegisterRequest;
import com.warehouse.entity.Role;
import com.warehouse.entity.User;
import com.warehouse.exception.BadRequestException;
import com.warehouse.repository.RoleRepository;
import com.warehouse.repository.UserRepository;
import com.warehouse.security.CustomUserDetailsService;
import com.warehouse.security.JwtTokenProvider;
import com.warehouse.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private Role adminRole;

    @BeforeEach
    void setUp() {
        adminRole = new Role();
        adminRole.setId(1L);
        adminRole.setName("ROLE_ADMIN");

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("warehouse_manager");
        testUser.setEmail("manager@warehouse.com");
        testUser.setPassword("encoded_pwd_123");
        testUser.setFullName("Warehouse Manager");
        testUser.setRole(adminRole);
    }

    @Test
    @DisplayName("login with valid credentials returns JWT token and user info")
    void login_validCredentials_returnsAuthResponse() {
        LoginRequest request = new LoginRequest();
        request.setUsername("warehouse_manager");
        request.setPassword("Secret123!");

        Authentication mockAuth = mock(Authentication.class);
        UserDetails mockUserDetails = mock(UserDetails.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);
        when(mockAuth.getPrincipal()).thenReturn(mockUserDetails);
        when(tokenProvider.generateToken(mockUserDetails)).thenReturn("mock.jwt.token.string");
        when(userRepository.findByUsername("warehouse_manager")).thenReturn(Optional.of(testUser));

        AuthResponse response = authService.login(request);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mock.jwt.token.string");
        assertThat(response.getUsername()).isEqualTo("warehouse_manager");
        assertThat(response.getRole()).isEqualTo("ROLE_ADMIN");
    }

    @Test
    @DisplayName("login with invalid password throws BadCredentialsException")
    void login_invalidPassword_throwsBadCredentials() {
        LoginRequest request = new LoginRequest();
        request.setUsername("warehouse_manager");
        request.setPassword("WrongPassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Invalid credentials");
    }

    @Test
    @DisplayName("register with unique username and email successfully persists user")
    void register_success() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("new_staff");
        request.setEmail("staff@warehouse.com");
        request.setPassword("PlainPassword123");
        request.setFullName("John Staff");
        request.setRoleId(1L);

        UserDetails mockUserDetails = mock(UserDetails.class);

        when(userRepository.existsByUsername("new_staff")).thenReturn(false);
        when(userRepository.existsByEmail("staff@warehouse.com")).thenReturn(false);
        when(roleRepository.findById(1L)).thenReturn(Optional.of(adminRole));
        when(passwordEncoder.encode("PlainPassword123")).thenReturn("hashed_pwd");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(5L);
            return u;
        });
        when(userDetailsService.loadUserByUsername("new_staff")).thenReturn(mockUserDetails);
        when(tokenProvider.generateToken(mockUserDetails)).thenReturn("new.user.jwt.token");

        AuthResponse response = authService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("new.user.jwt.token");
        assertThat(response.getUsername()).isEqualTo("new_staff");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("register with existing username throws BadRequestException")
    void register_usernameExists_throwsBadRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("warehouse_manager");
        request.setEmail("different@warehouse.com");

        when(userRepository.existsByUsername("warehouse_manager")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Username already exists");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("register with existing email throws BadRequestException")
    void register_emailExists_throwsBadRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("unique_user");
        request.setEmail("manager@warehouse.com");

        when(userRepository.existsByUsername("unique_user")).thenReturn(false);
        when(userRepository.existsByEmail("manager@warehouse.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Email already exists");

        verify(userRepository, never()).save(any());
    }
}
