
package com.local.market_finder;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sellers")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class SellerController {

	private final SellerRepo sellerRepo;

	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public SellerController(SellerRepo sellerRepo) {
		this.sellerRepo = sellerRepo;
	}

	// SELLER REGISTRATION
	@PostMapping("/register")
	public ResponseEntity<String> registerSeller(@RequestBody Seller seller) {

		if (seller.getMobile() != null && sellerRepo.existsByMobile(seller.getMobile())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Mobile number already registered");
		}

		if (seller.getSellerName() == null || seller.getSellerName().isBlank() || seller.getShopName() == null
				|| seller.getShopName().isBlank() || seller.getMobile() == null
				|| !seller.getMobile().matches("[0-9]{10}") || seller.getPassword() == null
				|| seller.getPassword().length() < 6 || seller.getArea() == null || seller.getArea().isBlank()
				|| seller.getCity() == null || seller.getCity().isBlank()) {

			return ResponseEntity.badRequest().body("Please enter all details correctly");
		}

		seller.setPassword(passwordEncoder.encode(seller.getPassword()));

		sellerRepo.save(seller);

		return ResponseEntity.status(HttpStatus.CREATED).body("Seller registered successfully");
	}

	// SELLER LOGIN
	@PostMapping("/login")
	public ResponseEntity<?> loginSeller(@RequestBody Seller seller) {

		return sellerRepo.findByMobile(seller.getMobile())
				.filter(existingSeller -> passwordEncoder.matches(seller.getPassword(), existingSeller.getPassword()))
				.<ResponseEntity<?>>map(existingSeller -> ResponseEntity
						.ok(Map.of("id", existingSeller.getId(), "sellerName", existingSeller.getSellerName(),
								"shopName", existingSeller.getShopName(), "mobile", existingSeller.getMobile(), "area",
								existingSeller.getArea(), "city", existingSeller.getCity())))
				.orElseGet(
						() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid mobile number or password"));
	}

	// UPDATE SELLER PROFILE
	@PutMapping("/{id}")
	public ResponseEntity<String> updateSeller(@PathVariable Long id, @RequestBody Seller updatedSeller) {

		// Validate profile details
		if (updatedSeller.getSellerName() == null || updatedSeller.getSellerName().isBlank()
				|| updatedSeller.getShopName() == null || updatedSeller.getShopName().isBlank()
				|| updatedSeller.getMobile() == null || !updatedSeller.getMobile().matches("[0-9]{10}")
				|| updatedSeller.getArea() == null || updatedSeller.getArea().isBlank()
				|| updatedSeller.getCity() == null || updatedSeller.getCity().isBlank()) {

			return ResponseEntity.badRequest().body("Please enter all details correctly");
		}

		return sellerRepo.findById(id).map(existingSeller -> {

			// Check whether another seller uses this mobile number
			boolean mobileUsedByAnotherSeller = sellerRepo.findByMobile(updatedSeller.getMobile())
					.filter(s -> !s.getId().equals(id)).isPresent();

			if (mobileUsedByAnotherSeller) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Mobile number already registered");
			}

			// Update seller details
			existingSeller.setSellerName(updatedSeller.getSellerName());

			existingSeller.setShopName(updatedSeller.getShopName());

			existingSeller.setMobile(updatedSeller.getMobile());

			existingSeller.setArea(updatedSeller.getArea());

			existingSeller.setCity(updatedSeller.getCity());

			sellerRepo.save(existingSeller);

			return ResponseEntity.ok("Seller profile updated successfully");

		}).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found"));
	}

	// DEMO: RESET SELLER PASSWORD
	@PutMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {

		String mobile = request.get("mobile");
		String newPassword = request.get("newPassword");

		if (mobile == null || !mobile.matches("[0-9]{10}")) {

			return ResponseEntity.badRequest().body("Please enter a valid 10-digit mobile number");
		}

		if (newPassword == null || newPassword.length() < 6) {

			return ResponseEntity.badRequest().body("Password must contain at least 6 characters");
		}

		return sellerRepo.findByMobile(mobile).map(seller -> {

			seller.setPassword(passwordEncoder.encode(newPassword));

			sellerRepo.save(seller);

			return ResponseEntity.ok("Password reset successfully. Please login again.");

		}).orElseGet(
				() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found with this mobile number"));
	}
}
