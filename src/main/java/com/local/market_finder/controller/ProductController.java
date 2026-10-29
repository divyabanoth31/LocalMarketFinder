
package com.local.market_finder.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.local.market_finder.Seller;
import com.local.market_finder.SellerRepo;
import com.local.market_finder.model.Product;
import com.local.market_finder.repo.ProductRepo;

@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
@RestController
public class ProductController {

    private final ProductRepo productRepo;
    private final SellerRepo sellerRepo;

    public ProductController(
            ProductRepo productRepo,
            SellerRepo sellerRepo) {
        this.productRepo = productRepo;
        this.sellerRepo = sellerRepo;
    }

    // CUSTOMER: GET PRODUCTS FROM ALL SELLERS
    @GetMapping("/customer/products")
    public ResponseEntity<?> getCustomerProducts() {

        List<Product> products = productRepo.findAll();

        List<Map<String, Object>> result = new ArrayList<>();

        for (Product product : products) {

            Map<String, Object> item = new LinkedHashMap<>();

            item.put("id", product.getId());
            item.put("productName", product.getProductName());
            item.put("category", product.getCategory());
            item.put("price", product.getPrice());
            item.put("stockQuantity", product.getStockQuantity());
            item.put("description", product.getDescription());

            Seller seller = product.getSeller();

            if (seller != null) {
                item.put("sellerId", seller.getId());
                item.put("sellerName", seller.getSellerName());
                item.put("sellerMobile", seller.getMobile());
            }

            result.add(item);
        }

        return ResponseEntity.ok(result);
    }

    // SELLER: GET PRODUCTS BELONGING TO THAT SELLER
    @GetMapping("/getproductlist/{sellerId}")
    public ResponseEntity<?> getAllProducts(
            @PathVariable Long sellerId) {

        if (!sellerRepo.existsById(sellerId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Seller not found");
        }

        return ResponseEntity.ok(
                productRepo.findBySeller_Id(sellerId));
    }

    // CREATE PRODUCT
    @PostMapping("/addproduct/{sellerId}")
    public ResponseEntity<?> addProduct(
            @PathVariable Long sellerId,
            @RequestBody Product product) {

        Seller seller = sellerRepo.findById(sellerId)
                .orElse(null);

        if (seller == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Seller not found");
        }

        product.setId(null);
        product.setSeller(seller);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productRepo.save(product));
    }

    // GET PRODUCT BY ID - ONLY ITS OWNER
    @GetMapping("/getproduct/{id}/seller/{sellerId}")
    public ResponseEntity<?> getProductById(
            @PathVariable Long id,
            @PathVariable Long sellerId) {

        Product product = productRepo.findById(id).orElse(null);

        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product not found");
        }

        if (product.getSeller() == null
                || !product.getSeller().getId().equals(sellerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You cannot access another seller's product");
        }

        return ResponseEntity.ok(product);
    }

    // UPDATE PRODUCT - ONLY ITS OWNER
    @PutMapping("/updateproduct/{id}/seller/{sellerId}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @PathVariable Long sellerId,
            @RequestBody Product updatedProduct) {

        Product product = productRepo.findById(id).orElse(null);

        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product not found");
        }

        if (product.getSeller() == null
                || !product.getSeller().getId().equals(sellerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You cannot update another seller's product");
        }

        product.setProductName(updatedProduct.getProductName());
        product.setCategory(updatedProduct.getCategory());
        product.setPrice(updatedProduct.getPrice());
        product.setStockQuantity(updatedProduct.getStockQuantity());
        product.setDescription(updatedProduct.getDescription());

        return ResponseEntity.ok(productRepo.save(product));
    }

    // DELETE PRODUCT - ONLY ITS OWNER
    @DeleteMapping("/deleteproduct/{id}/seller/{sellerId}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id,
            @PathVariable Long sellerId) {

        Product product = productRepo.findById(id).orElse(null);

        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product not found");
        }

        if (product.getSeller() == null
                || !product.getSeller().getId().equals(sellerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You cannot delete another seller's product");
        }

        productRepo.delete(product);

        return ResponseEntity.ok("Product deleted successfully");
    }
}
