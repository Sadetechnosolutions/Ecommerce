package com.SadeTechoSolution.Cart.Repo;

import com.SadeTechoSolution.Cart.Model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
