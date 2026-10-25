package com.smartinsurance.claims.controller;

import com.smartinsurance.claims.dto.ProductResponse;
import com.smartinsurance.claims.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductResponse> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        return productService.getProducts(category, search);
    }

    @GetMapping("/{id}")
    public ProductResponse getProduct(
            @PathVariable Long id) {

        return productService.getProduct(id);
    }
}