package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.AdminProductResponse;
import com.smartinsurance.claims.dto.ProductRequest;
import com.smartinsurance.claims.dto.ProductResponse;
import com.smartinsurance.claims.entity.InsuranceProduct;
import com.smartinsurance.claims.repository.InsuranceProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final InsuranceProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<AdminProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Transactional
    public ProductResponse createProduct(
            ProductRequest request) {

        InsuranceProduct product =
                new InsuranceProduct();

        applyRequest(product, request);
        product.setActive(true);

        return toResponse(
                productRepository.save(product)
        );
    }

    @Transactional
    public ProductResponse updateProduct(
            Long productId,
            ProductRequest request) {

        InsuranceProduct product =
                findProduct(productId);

        applyRequest(product, request);

        return toResponse(
                productRepository.save(product)
        );
    }

    @Transactional
    public ProductResponse deactivateProduct(
            Long productId) {

        InsuranceProduct product =
                findProduct(productId);

        product.setActive(false);

        return toResponse(
                productRepository.save(product)
        );
    }

    @Transactional
    public ProductResponse activateProduct(
            Long productId) {

        InsuranceProduct product =
                findProduct(productId);

        product.setActive(true);

        return toResponse(
                productRepository.save(product)
        );
    }

    private InsuranceProduct findProduct(
            Long productId) {

        return productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Insurance product not found"
                        )
                );
    }

    private void applyRequest(
            InsuranceProduct product,
            ProductRequest request) {

        product.setProductName(
                request.getProductName().trim()
        );

        product.setProductCategory(
                request.getProductCategory()
                        .trim()
                        .toUpperCase()
        );

        product.setCoverageAmount(
                request.getCoverageAmount()
        );

        product.setPremiumAmount(
                request.getPremiumAmount()
        );

        product.setPolicyTenureMonths(
                request.getPolicyTenureMonths()
        );
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

    private AdminProductResponse toAdminResponse(
            InsuranceProduct product) {

        return new AdminProductResponse(
                product.getId(),
                product.getProductName(),
                product.getProductCategory(),
                product.getCoverageAmount(),
                product.getPremiumAmount(),
                product.getPolicyTenureMonths(),
                product.getActive()
        );
    }
}
