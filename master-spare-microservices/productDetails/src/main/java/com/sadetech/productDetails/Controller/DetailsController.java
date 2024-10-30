package com.sadetech.productDetails.Controller;

import com.sadetech.productDetails.Service.DetailsService;
import com.sadetech.productDetails.model.ProductDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/product_details")
public class DetailsController {

    @Autowired
    public DetailsService productDetailsService;

    // Get all product details
    @GetMapping("/getAll-products")
    public List<ProductDetails> getAllProductDetails() {
        return productDetailsService.getAllProductDetails();
    }

    // Get a product detail by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetails> getProductDetailsById(@PathVariable("id") Long id) {
        Optional<ProductDetails> productDetails = productDetailsService.getProductDetailsById(id);
        return productDetails.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new product detail
    @PostMapping ("/upload")
    public ResponseEntity<ProductDetails> createProductDetails(@RequestParam("file") MultipartFile file,
                                               @RequestParam("name")String name,
                                               @RequestParam("price")String price,
                                               @RequestParam("quantity")String quantity,
                                               @RequestParam("type")String type,
                                               @RequestParam("size")String size,
                                               @RequestParam("length")String length,
                                               @RequestParam("contentType")String contentType,
                                               @RequestParam("material")String material,
                                               @RequestParam("brandName")String brandName,
                                               @RequestParam("modelNumber")String modelNumber,
                                               @RequestParam("standard")String standard,
                                               @RequestParam("finish")String finish,
                                               @RequestParam("certificate")String certificate,
                                               @RequestParam("grade")String grade) throws IOException {
        ProductDetails productDetails = productDetailsService.saveProductDetails(file, name, price, quantity, type, size, length, contentType, material, brandName, modelNumber, standard, finish, certificate, grade);
        return ResponseEntity.ok(productDetails);
    }

    // Delete a product detail by ID
    @DeleteMapping("/delete-product/{id}")
    public ResponseEntity<Void> deleteProductDetails(@PathVariable("id") Long id) {
        if (productDetailsService.getProductDetailsById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        productDetailsService.deleteProductDetails(id);
        return ResponseEntity.noContent().build();
    }
}