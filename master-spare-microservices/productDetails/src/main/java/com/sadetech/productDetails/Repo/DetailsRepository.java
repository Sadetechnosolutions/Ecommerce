package com.sadetech.productDetails.Repo;
import com.sadetech.productDetails.model.ProductDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetailsRepository extends JpaRepository<ProductDetails, Long> {


}
