package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.AdminProductResponse;
import com.smartinsurance.claims.dto.ProductRequest;
import com.smartinsurance.claims.dto.ProductResponse;
import com.smartinsurance.claims.service.AdminProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping
    public List<AdminProductResponse> getAllProducts() {

        return adminProductService.getAllProducts();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse createProduct(
            @Valid @RequestBody
            ProductRequest request) {

        return adminProductService
                .createProduct(request);
    }

    @PutMapping("/{productId}")
    public ProductResponse updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody
            ProductRequest request) {

        return adminProductService
                .updateProduct(
                        productId,
                        request
                );
    }

    @PatchMapping("/{productId}/deactivate")
    public ProductResponse deactivateProduct(
            @PathVariable Long productId) {

        return adminProductService
                .deactivateProduct(productId);
    }

    @PatchMapping("/{productId}/activate")
    public ProductResponse activateProduct(
            @PathVariable Long productId) {

        return adminProductService
                .activateProduct(productId);
    }
}
