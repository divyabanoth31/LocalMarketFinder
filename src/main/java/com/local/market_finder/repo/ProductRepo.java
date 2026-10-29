
package com.local.market_finder.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.local.market_finder.model.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

    // Fetch products belonging to a particular seller
    List<Product> findBySeller_Id(Long sellerId);

}
