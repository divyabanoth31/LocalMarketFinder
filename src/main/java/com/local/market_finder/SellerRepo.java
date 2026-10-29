
package com.local.market_finder;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerRepo extends JpaRepository<Seller, Long> {

    Optional<Seller> findByMobile(String mobile);

    boolean existsByMobile(String mobile);
}
