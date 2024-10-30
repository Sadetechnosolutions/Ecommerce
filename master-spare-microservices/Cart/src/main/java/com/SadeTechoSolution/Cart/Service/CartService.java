package com.SadeTechoSolution.Cart.Service;

import com.SadeTechoSolution.Cart.Model.CartItem;
import com.SadeTechoSolution.Cart.Repo.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service

public class CartService {
    @Autowired
    private CartItemRepository cartItemRepository;

    public CartItem addToCart(CartItem item) {
        return cartItemRepository.save(item);
    }

    public List<CartItem> getCartItems() {
        return cartItemRepository.findAll();
    }
}