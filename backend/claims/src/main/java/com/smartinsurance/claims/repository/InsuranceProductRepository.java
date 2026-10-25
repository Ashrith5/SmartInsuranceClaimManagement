package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.InsuranceProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InsuranceProductRepository
        extends JpaRepository<InsuranceProduct, Long> {

    List<InsuranceProduct> findByActiveTrue();

    List<InsuranceProduct> findByProductCategoryIgnoreCaseAndActiveTrue(
            String productCategory);

    List<InsuranceProduct> findByProductNameContainingIgnoreCaseAndActiveTrue(
            String productName);
}