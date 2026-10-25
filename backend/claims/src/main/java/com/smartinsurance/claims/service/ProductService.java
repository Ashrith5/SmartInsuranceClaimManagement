package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.ProductResponse;
import com.smartinsurance.claims.entity.InsuranceProduct;
import com.smartinsurance.claims.repository.InsuranceProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final InsuranceProductRepository productRepository;

    public List<ProductResponse> getProducts(
            String category,
            String search) {

        List<InsuranceProduct> products;

        if (search != null && !search.isBlank()) {
            products =
                    productRepository
                            .findByProductNameContainingIgnoreCaseAndActiveTrue(
                                    search.trim());
        } else if (category != null && !category.isBlank()) {
            products =
                    productRepository
                            .findByProductCategoryIgnoreCaseAndActiveTrue(
                                    category.trim());
        } else {
            products = productRepository.findByActiveTrue();
        }

        return products.stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse getProduct(Long id) {

        InsuranceProduct product = productRepository
                .findById(id)
                .filter(InsuranceProduct::getActive)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Insurance product not found"));

        return toResponse(product);
    }

    private ProductResponse toResponse(
            InsuranceProduct product) {

        return new ProductResponse(
                product.getId(),
                product.getProductName(),
                product.getProductCategory(),
                product.getCoverageAmount(),
                product.getPremiumAmount(),
                product.getPolicyTenureMonths()
        );
    }
}