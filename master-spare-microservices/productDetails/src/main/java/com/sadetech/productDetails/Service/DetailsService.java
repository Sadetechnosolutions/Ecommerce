package com.sadetech.productDetails.Service;


import com.sadetech.productDetails.Repo.DetailsRepository;
import com.sadetech.productDetails.model.ProductDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class DetailsService {

    @Autowired
    private DetailsRepository productDetailsRepository;

    @Autowired
    private FileUploadService fileUploadService;

    // Get all product details
    public List<ProductDetails> getAllProductDetails() {
        return productDetailsRepository.findAll();
    }

    // Get a product detail by ID
    public Optional<ProductDetails> getProductDetailsById(Long id) {
        return productDetailsRepository.findById(id);
    }

    // Save a new product detail or update an existing one
    public ProductDetails saveProductDetails(MultipartFile file,String name,String price,
                                             String quantity,String type,String size,String length,
                                             String contentType,String material,String brandName,
                                             String modelNumber,String standard,String finish,
                                             String certificate,String grade) throws IOException {
        String filePath = fileUploadService.uploadFile(file);

        ProductDetails productDetails = new ProductDetails();
        productDetails.setContent(filePath);
        productDetails.setName(name);
        productDetails.setPrice(price);
        productDetails.setQuantity(quantity);
        productDetails.setType(type);
        productDetails.setSize(size);
        productDetails.setLength(length);
        productDetails.setContentType(contentType);
        productDetails.setMaterial(material);
        productDetails.setBrandName(brandName);
        productDetails.setModelNumber(modelNumber);
        productDetails.setStandard(standard);
        productDetails.setFinish(finish);
        productDetails.setCertificate(certificate);
        productDetails.setGrade(grade);

        return productDetailsRepository.save(productDetails);
    }

    // Delete a product detail by ID
    public void deleteProductDetails(Long id) {
        productDetailsRepository.deleteById(id);
    }


}

