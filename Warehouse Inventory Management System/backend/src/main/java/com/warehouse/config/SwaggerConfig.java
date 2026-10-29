package com.warehouse.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI warehouseOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Warehouse & Inventory Management System API")
                        .description("REST API for managing warehouse operations, inventory, purchases, and sales")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Ansh Tandel")
                                .email("ansh@example.com")));
    }
}
