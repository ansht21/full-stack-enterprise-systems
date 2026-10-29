package com.warehouse.service;

import com.warehouse.dto.*;
import com.warehouse.entity.*;

import java.util.List;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    User getCurrentUser();
    void changePassword(ChangePasswordDTO dto);
}
